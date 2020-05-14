# frozen_string_literal: true

module StripePlanMethods
  extend ActiveSupport::Concern

  included do  
    attr_accessor :payment_method_id
    has_one :trial_period, dependent: :destroy
    has_one :billing, dependent: :destroy
    has_many :subscriptions, dependent: :destroy 
    after_create :set_trial_period
  end
  
  def set_trial_period
    trial_end = created_at + ENV["TRIAL_DAYS"].to_i.days
    days = (trial_end.to_date - created_at.to_date).to_i
    tp = self.create_trial_period(start: created_at, end: trial_end, active: true , days: days)
  end

  def plan
    active_subscription.plan rescue nil
  end 

  def plan_name
    if active_subscription.blank? && !trial_expired?
      trial_end = trial_period.end.strftime("%B %d, %Y")
      return "Basic Plan (30 Days). Trial ends on #{trial_end}"
    elsif !active_plan.free? && active_subscription.payment_type == "stripe"
      return active_plan.name + ", Ends on #{plan_end_date}, " + active_plan.interval.to_s.humanize + " Billing"
    elsif !active_plan.free? && (active_subscription.payment_type == "check" || active_subscription.payment_type == "cash")
      return active_plan.name + ", Ends on #{plan_end_date}"
    else
      return active_plan.name + " Plan"
    end
  end

  def plan_end_date
    if active_subscription.payment_type == "stripe"
      t = Time.at(active_subscription.current_period_end.to_i).strftime("%B %d, %Y") rescue '-'
    else
      t =  active_subscription.payment_ends_on.strftime("%B %d, %Y") rescue '-'
    end
    return t
  end

  def active_plan 
    # cached_plan = Rails.cache.read(key)
    # cached_paid_plan = cached_plan && (cached_plan.name.downcase.to_sym == :basic || cached_plan.name.downcase.to_sym == :premium || cached_plan.name.downcase.to_sym == :ultra)
    # if cached_plan.present? && cached_paid_plan
    #   cached_plan
    # else
      paid_plan_user = plan && ['standard','premium'].include?(plan.category.downcase)
      if plan && paid_plan_user   
        plan
      elsif !trial_expired? && !Rails.env.development?
        Plan.where(stripe_plan_id: "standard-monthly-500").first
      else
        Plan.where(stripe_plan_id: "free-plan").first
      end
    #end
  end

  def active_subscription
    subscriptions.where(:is_active => true).first 
  end



  def free_plan? 
    (active_plan && active_plan.name.downcase.to_sym == :free) ? true : false 
  end

  def paid_plan?
    (plan_standard? || plan_premium?) ? true : false 
  end

  def plan_standard? 
    (active_plan && active_plan.name.downcase.to_sym == :standard) ? true : false 
  end

  def plan_premium?
    (active_plan && active_plan.name.downcase.to_sym == :full) ? true : false 
  end


  # def premium_or_ultra_plan?
  #   (plan_premium? || ultra_plan?) ? true : false 
  # end

  # def ultra_plan?
  #   (active_plan && active_plan.name.downcase.to_sym == :ultra) ? true : false 
  # end


  def in_trial_period?
    active_subscription.blank? && !trial_expired?
  end

  def trial_remaining_days
    trial_period.present? ? (trial_period.end.to_date - Date.today).round : 0
  end

  def trial_expired?
    if (trial_period && trial_period.active == false) || self.trial_remaining_days <= 0
      return true
    else
      return false
    end
  end


  def upgrade_plan(agent, selected_plan, billing_params)
    billing_params[:email] = agent.email if billing_params[:email].strip.blank?

    if billing.blank?
      create_billing(billing_params)
    else
      billing.update_attributes(billing_params)
    end 

    stripe_plan_id = selected_plan.stripe_plan_id
    stripe_customer_id = billing.stripe_customer_id 

    ##START##
    begin
      if stripe_customer_id.blank?
        customer = Stripe::Customer.create(name: billing.name, email: billing.email, payment_method: payment_method_id)
      else
        customer = Stripe::Customer.retrieve(stripe_customer_id)
        if customer && payment_method_id.present?
          pm = Stripe::PaymentMethod.attach(payment_method_id,{customer: customer.id}) 
          if customer.email.downcase.strip != billing.email
            Stripe::Customer.update(customer.id, {name: billing.name ,email: billing.email})
          end
          #Stripe::Customer.update(customer.id, {invoice_settings: {default_payment_method: pm.id} })
        end
      end 

      if customer
        current_subscription = self.active_subscription
        # existing_subscriptions = subscriptions
        # if existing_subscriptions
        #   existing_subscriptions.each do |sub|
        #     Stripe::Subscription.delete(sub.stripe_subscription_id)
        #   end
        # end

        if current_subscription
          Stripe::Subscription.delete(current_subscription.stripe_subscription_id, {prorate: true, invoice_now: true})
        end


        if selected_plan.amount_cents > 0
          ###
          billing.stripe_customer_id = customer.id
          billing.stripe_card_id = payment_method_id if payment_method_id.present?
          billing.save
          ####

          

          result = Stripe::Subscription.create({
            customer: customer.id,
            default_payment_method: payment_method_id,
            items: [{plan: stripe_plan_id}, {plan: stripe_plan_id + "-metered"} ],
            proration_behavior: 'create_prorations'
          })  
          #result = customer.update_subscription(items: [{plan: stripe_plan_id}]) #if customer.save
          p result
          if result

            if result.status == "active" || result.status == "trialing"
              current_subscription.update_attributes!(:status => "Upgraded to #{ selected_plan.name }") if !current_subscription.blank?
            else
              current_subscription.update_attributes!(:status => "(Previous Status: #{current_subscription.status}) - Auto Disabled in case of PAST_DUE: waiting on payment confirmation for #{ selected_plan.name }") if !current_subscription.blank?
            end

            self.subscriptions.update_all(:is_active => false)

            new_subscription = self.subscriptions.build
            new_subscription.agent_id = agent.id
            new_subscription.status = result.status.to_s 
            new_subscription.stripe_subscription_id = result.id
            new_subscription.plan_id = selected_plan.id  
            new_subscription.stripe_customer_id = result.customer
            new_subscription.current_period_start = result.current_period_start
            new_subscription.current_period_end = result.current_period_end
            new_subscription.canceled_at = result.canceled_at
            new_subscription.start = result.start_date 
            pm = Stripe::PaymentMethod.retrieve(result.default_payment_method)   
            if pm
              new_subscription.last4 = pm.card.last4
              p pm.card
              new_subscription.card_type = pm.card.brand
              #new_subscription.cardholder_name = pm.billing_details.name 
            end
            new_subscription.is_active = (result.status == "active" || result.status == "trialing") ? true : false
            new_subscription.save! 


            tp = trial_period
            if tp
              tp.active = false
              tp.save!
            end
            
            if result.status == "past_due"
              errors.add :base, "PAST DUE STRIPE SUBSCRIPTION: Your subscription will be updated once we receive payment confirmation from Stripe. Please contact us at #{ENV['support_email']}."
              return false
            end
          else
          
          end  
        elsif selected_plan.amount.zero? 
           self.subscriptions.update_all(:is_active => false)
        else
          errors.add :base, "ST001: Something went wrong. Please contact #{ENV['support_email']}."
          false
        end
      else
        errors.add :base, "Stripe customer object is absent. Subscribe to any of our plans to generate STRIPE customer ID."
        false
      end
    rescue Stripe::InvalidRequestError, Stripe::CardError, Stripe::AuthenticationError, Stripe::APIConnectionError, Stripe::StripeError, Stripe::RateLimitError => e
      errors.add :base, e.message + "  - Please contact #{ENV['support_email']}"
      false
    rescue => e
      errors.add :base, e.message + "  - Please contact #{ENV['support_email']}"
      false
    end
    ##END##
  end



end

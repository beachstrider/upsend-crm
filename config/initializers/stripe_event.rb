#StripeEvent.signing_secret = ENV['STRIPE_SIGNING_SECRET']
StripeEvent.signing_secrets = [
  ENV['STRIPE_SIGNING_SECRET1'] 
] 
StripeEvent.event_filter = lambda do |event|
    if event.livemode
        stripe_account_id = event.account rescue nil
        if stripe_account_id.present?
          ::Stripe::Event.retrieve(event.id,{stripe_account: stripe_account_id}) 
        else
          ::Stripe::Event.retrieve(event.id)
        end
    else
        event
    end
end

StripeEvent.configure do |events|

  events.subscribe 'customer.deleted' do |event|
    # deleted_customer_id = event.data.object.id
    # school = School.where(stripe_customer_id: deleted_customer_id).first rescue nil
    # if school
    #   school.stripe_customer_id = ""
    #   school.save!
    # end
  end

  events.subscribe 'invoice.payment_succeeded' do |event| 
    #StripeWorker.perform_async(event.id)
  end
  
  events.subscribe 'invoice.upcoming' do |event| 
    #StripeWorker.perform_async(event.id)
  end 

  events.subscribe 'invoice.payment_failed' do |event|
    # #Your webhook endpoint updates the customer’s current_period_end timestamp in your database to the appropriate date in the future (plus a day or two for leeway).
    # puts "invoice.payment_failed"
    # charge = event.data.object
    # customer_id = charge.customer
    # stripe_subscription = charge.subscription.present? ? charge.subscription : charge.lines.data.first
    # school_subscription = Subscription.where(subscription_id: stripe_subscription.id, stripe_customer_id: customer_id, is_active: true).first rescue nil
    # if school_subscription
    #   puts "invoice.payment_failed executed"
    #   school_subscription.is_active = false
    #   school_subscription.save!
    #   StripeMailer.delay(:retry => false).admin_charge_failed(event.id, school_subscription.id)
    # else
    #   #notify Dev Team
    #   DevMailer.notify_support("School Subscription - Stripe Payment Failed- Active Subscription not found in database. ", event.to_s, "" ).deliver_now
    # end

  end

  events.subscribe 'customer.subscription.trial_will_end' do |event|
    #3 days before the trial ends
    #past_due: webhook script could email - customer - update their payment details.
    #canceled or unpaid: your webhook script should ensure the customer is no longer receiving your products or services.
    #charge = event.data.object
  end

  events.subscribe 'customer.subscription.updated' do |event|
    # puts "customer.subscription.updated"
    # stripe_subscription = event.data.object
    # school_subscription = Subscription.where(subscription_id: stripe_subscription.id, stripe_customer_id: stripe_subscription.customer, is_active: true).first rescue nil
    # if school_subscription.present?
    #   puts "customer.subscription.updated Subscription found in database"
    #   school = school_subscription.school
    #   school_subscription.is_active = false
    #   puts stripe_subscription.status
    #   if stripe_subscription.status == "active" || stripe_subscription.status == "trialing"
    #     school_subscription.is_active = true
    #   end
    #   school_subscription.canceled_at = stripe_subscription.canceled_at
    #   school_subscription.current_period_end = stripe_subscription.current_period_end
    #   school_subscription.current_period_start = stripe_subscription.current_period_start
    #   school_subscription.status = stripe_subscription.status.to_s
    #   school_subscription.save!
    # elsif stripe_subscription.present?
    #   school_subscription = Subscription.where(subscription_id: stripe_subscription.id, stripe_customer_id: stripe_subscription.customer, is_active: false, status: "past_due").first rescue nil
    #   if school_subscription && stripe_subscription && school_subscription.status == "past_due" && school_subscription.stripe_plan_id == stripe_subscription.plan.id
    #     school_subscription.is_active = true
    #     school_subscription.canceled_at = stripe_subscription.canceled_at
    #     school_subscription.current_period_end = stripe_subscription.current_period_end
    #     school_subscription.current_period_start = stripe_subscription.current_period_start
    #     school_subscription.status = stripe_subscription.status.to_s
    #     school_subscription.save!
    #   end
    # end
  end

  events.subscribe 'customer.subscription.deleted' do |event|
    # puts "customer.subscription"
    # stripe_subscription = event.data.object
    # school_subscription = Subscription.where(subscription_id: stripe_subscription.id, stripe_customer_id: stripe_subscription.customer, is_active: true).first rescue nil
    # if school_subscription.present?
    #   puts "Subscription found in database"
    #   school = school_subscription.school
    #   school_subscription.is_active = false
    #   school_subscription.canceled_at = stripe_subscription.canceled_at
    #   school_subscription.current_period_end = stripe_subscription.current_period_end
    #   school_subscription.current_period_start = stripe_subscription.current_period_start
    #   school_subscription.status = stripe_subscription.status.to_s
    #   school_subscription.save!
    # else
    #   #notify Dev Team
    #   DevMailer.notify_support("Stripe Subscription Deleted - Active Subscription not found in database. ", event.to_s, "" ).deliver_now
    # end
  end


  
  # events.subscribe 'customer.subscription.created' do |event|
  #   charge = event.data.object
  # end
  #
  # events.subscribe 'invoice.created' do |event|
  #   # If you’re using webhooks, Stripe waits to receive a successful response to the invoice.created event before attempting payment.
  #   charge = event.data.object
  # end
  #
  events.subscribe 'charge.succeeded' do |event|
    # charge = event.data.object
    # donation = Donation.where(charge_id: charge.id).first
    # if donation
    #   donation.stripe_charge_succeeded = true
    #   donation.status = :completed
    #   donation.save 
    #   if donation.send_receipt == true && donation.payment_date <= Date.current && donation.ach_bank_transfer?
    #     # We are sending this recipt only for ACH becoz it was not sent earlier. 
    #     # For credit cards this email is already sent instantly and should not be sent again. Will cause duplicate email issues.
    #     NotificationMailer.delay(:retry => false).fundraise_payment_success(donation.id)
    #   end
    # end

  end
  # events.subscribe 'charge.failed' do |event|
  #   charge = event.data.object
  # end
  # events.subscribe 'charge.pending' do |event|
  #   charge = event.data.object
  # end
  # events.subscribe 'charge.captured' do |event|
  #   charge = event.data.object
  # end
  # events.subscribe 'charge.expired' do |event|
  #   charge = event.data.object
  # end 
  events.subscribe 'charge.dispute.created' do |event|
    #StripeMailer.admin_dispute_created(event.data.object).deliver
  end


  events.subscribe 'charge.refunded' do |event| 
    #charge = event.data.object
  end

  events.subscribe 'application_fee.refunded' do |event| 
    #charge = event.data.object
  end 

  # events.subscribe 'charge.failed' do |event| 
  # end



end


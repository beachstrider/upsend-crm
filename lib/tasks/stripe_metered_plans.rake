namespace :stripe_metered_plans do
  desc "Creating stripe account plans"
  task :create => :environment do
    if Rails.env.development?
      
       
      Plan.where(plan_type:'metered').uniq.each do |plan|
        p "deleting"
        begin
        d = Stripe::Plan.retrieve(plan.stripe_plan_id).delete
        p d
        rescue
          p "plan not found #{plan.stripe_plan_id}"
        end
        plan.delete
      end

      # loop do
      #   splans = Stripe::Plan.list 
      #   Stripe::Plan.list.each{|pl| pl.delete}  
      #   finished = splans.blank? || (splans && !splans.has_more)
      #   puts "deleting plans"
      #   if finished 
      #     break       
      #   end
      # end
      # loop do
      #   sproducts = Stripe::Product.list 
      #   Stripe::Product.list.each{|pl| pl.delete} 
      #   finished = sproducts.blank? || (sproducts && !sproducts.has_more)
      #   puts "deleting products"
      #   if finished 
      #     break        
      #   end
      # end 
    end


    [{
      name: "Standard",
      category: "Standard",
      interval: 0,
      amount_cents: (50*100),
      amount_currency: "USD", 
      trial_days: ENV["TRIAL_DAYS"],
      stripe_plan_id: "standard-monthly",
      stripe_product_id: "product-standard-monthly",
      seats: 3,
      variants: [
        {price: 9.99, contacts: 500, emails: 5000, additional_price: 4.99,additional_contacts: 250, additional_emails: 2500}, 
        {price: 19.99, contacts: 1500, emails: 15000, additional_price: 9.99,additional_contacts: 500, additional_emails: 5000}, 
        {price: 29.99, contacts: 2500, emails: 25000, additional_price: 9.99,additional_contacts: 500, additional_emails: 5000}, 
        {price: 49.99, contacts: 5000, emails: 50000, additional_price: 9.99,additional_contacts: 500, additional_emails: 5000}, 
        {price: 74.99, contacts: 10000, emails: 100000, additional_price: 14.99,additional_contacts: 1000, additional_emails: 10000}, 
        {price: 129, contacts: 15000, emails: 150000, additional_price: 14.99,additional_contacts: 1000, additional_emails: 10000}, 
        {price: 159, contacts: 20000, emails: 200000, additional_price: 19.99,additional_contacts: 2000, additional_emails: 20000}, 
        {price: 189, contacts: 25000, emails: 250000, additional_price: 19.99,additional_contacts: 2000, additional_emails: 20000}, 
        {price: 219, contacts: 30000, emails: 300000, additional_price: 19.99,additional_contacts: 2000, additional_emails: 20000}, 
        {price: 249, contacts: 40000, emails: 400000, additional_price: 24.99,additional_contacts: 3000, additional_emails: 30000}, 
        {price: 259, contacts: 50000, emails: 500000, additional_price: 59.99,additional_contacts: 4000, additional_emails: 40000}, 
      ]
    },
    {
      name: "Premium",
      category: "Premium",
      interval: 0, 
      amount_cents: (100 * 100),
      amount_currency: "USD", 
      trial_days: ENV["TRIAL_DAYS"],
      stripe_plan_id: "premium-monthly",
      stripe_product_id: "product-premium-monthly",
      seats: 6,
      variants: [
        {price: 14.99, contacts: 500, emails: 6000, additional_price: 4.99, additional_contacts: 150, additional_emails: 1800}, 
        {price: 49.99, contacts: 2500, emails: 30000, additional_price: 9.99,additional_contacts: 300, additional_emails: 3600}, 
        {price: 74.99, contacts: 5000, emails: 60000, additional_price: 14.99,additional_contacts: 500, additional_emails: 6000},  
        {price: 99, contacts: 10000, emails: 120000, additional_price: 19.99,additional_contacts: 1000, additional_emails: 12000}, 
        {price: 159, contacts: 15000, emails: 180000, additional_price: 19.99,additional_contacts: 1000, additional_emails: 12000}, 
        {price: 189, contacts: 20000, emails: 240000, additional_price: 24.99,additional_contacts: 2000, additional_emails: 24000},  
        {price: 219, contacts: 25000, emails: 300000, additional_price: 24.99,additional_contacts: 2000, additional_emails: 24000},   
        {price: 249, contacts: 30000, emails: 360000, additional_price: 24.99,additional_contacts: 2000, additional_emails: 24000},
        {price: 269, contacts: 40000, emails: 480000, additional_price: 29.99,additional_contacts: 3000, additional_emails: 36000},
        {price: 299, contacts: 50000, emails: 600000, additional_price: 29.99,additional_contacts: 4000, additional_emails: 48000},
        {price: 399, contacts: 75000, emails: 900000, additional_price: 34.99,additional_contacts: 6000, additional_emails: 72000}, 
        {price: 499, contacts: 100000, emails: 1200000, additional_price: 79.99,additional_contacts: 6000, additional_emails: 72000},
      ] 
    }].each do |product| 
      if product[:variants].present? 
        product[:variants].each do |variant| 
          category = product[:category]
          v_name = product[:name] + " " + variant[:contacts].to_s
          v_parent_stripe_plan_id = product[:stripe_plan_id] + "-" + variant[:contacts].to_s
          v_stripe_plan_id = product[:stripe_plan_id] + "-" + variant[:contacts].to_s + "-metered"
          v_stripe_product_id = product[:stripe_product_id] + "-" + variant[:contacts].to_s
          
          ###
          v_price = (variant[:price]/variant[:contacts].to_f)
          v_price_cents_decimal = (v_price * 100)
          v_price_cents = (v_price * 100).ceil
          ####

          contacts = variant[:contacts] 
          emails = variant[:emails] 
          additional_price = variant[:additional_price] 
          #######
          additional_price_cents = ((variant[:price]/variant[:contacts].to_f * variant[:additional_contacts])* 100)
          ########
          additional_contacts = variant[:additional_contacts]
          additional_emails = variant[:additional_emails] 
          seats = product[:seats]




          variant_attrs = {
            name: v_name,
            category: category,
            interval: product[:interval], 
            amount_cents: v_price_cents,
            amount_decimal: v_price_cents_decimal,
            amount_currency: "USD", 
            trial_days: 0,
            stripe_plan_id: v_stripe_plan_id,
            stripe_product_id: v_stripe_product_id,
            contacts: contacts,
            emails: emails,
            additional_price_cents: additional_price_cents,
            additional_contacts: additional_contacts,
            additional_emails: additional_emails,
            seats: seats,
            plan_type: 'metered',
            parent_stripe_plan_id: v_parent_stripe_plan_id
          }
          Plan.create!(variant_attrs) 
        end 
      else
        #Plan.create!(product)  
      end
    end



    Plan.where(plan_type:'metered').each do |plan|
        # try to create a plan
        interval = "month" if plan.interval == "monthly"
        interval = "year" if plan.interval == "yearly"
        
        nickname = "Additional usage on " + plan.name
        description = "This records Additional usage on " + plan.name + ". Metered billing plan with (#{plan.interval}) interval." 
        begin
            my_plan = Stripe::Plan.create(
              :id => plan.stripe_plan_id,
              :amount_decimal => plan.amount_decimal,
              :interval => interval,
              :nickname => description,
              :product => plan.stripe_product_id,
              :currency => "usd", 
              :usage_type => plan.plan_type,
              aggregate_usage: 'last_ever',
              metadata: {description: description}
            )
            puts my_plan
            # catch any invalid request errors
        rescue Stripe::InvalidRequestError => e
            puts e.json_body[:error]
        end
    end


  end
end
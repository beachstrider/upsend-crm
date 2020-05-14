class Plan < ApplicationRecord
  enum interval: [:monthly, :yearly] 
  monetize :amount_cents
  monetize :additional_price_cents


  has_many :schools
  has_many :subscriptions

  def free?
    return true if self.name.downcase.to_sym == :free || self.amount_cents == 0
    return false
  end

  def display_plan_interval
    if interval == "monthly"
      return "month"
    elsif interval == "yearly"
      return "year"
    end
  end

  def display_plan_name
    if self.name.downcase.include? "basic"
      return "Basic"
    elsif self.name.downcase.include? "premium"
      return "Premium"
    elsif self.name.downcase.include? "ultra"
      return "Ultra"
    elsif self.name.downcase.include? "free"
      return "Free"
    end
  end

  def name_with_interval
    if self.free?
      return name + " Plan"
    else
      return name + ", " + interval.capitalize.to_s + " Billing"
    end
  end

  def amount_with_interval
    amount = amount_cents * 100
    return ActionController::Base.helpers.number_to_currency(amount, precision: 0) + "/" + display_plan_interval.capitalize
  end


end

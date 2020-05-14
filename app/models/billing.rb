class Billing < ApplicationRecord
  belongs_to :app
  before_save :check_email

  def name
    customer_name = first_name + " " + last_name
    customer_name.strip
  end

  def check_email
    self.email = email.downcase.strip if email.present?
  end

end

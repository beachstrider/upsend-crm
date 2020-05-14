module Types
  class PlanType < Types::BaseObject 
    field :id, ID, null: false
    field :name, String, null: false
    field :category, String, null: false
    field :stripe_plan_id, String, null: false 
    field :contacts, Int, null: false 
    field :emails, Int, null: false 
    field :amount, String, null: false 
    field :additional_contacts, String, null: false 
    field :additional_price, String, null: false 
    field :seats, Int, null: false 

    def contacts
      object.contacts.blank? ? 0 : object.contacts 
    end

    def seats
      object.seats.blank? ? 0 : object.seats 
    end

    def amount
      object.amount 
    end

    def additional_price
      object.additional_price 
    end
 
  end
end

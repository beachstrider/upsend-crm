class AddColumnsToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :contacts, :integer
    add_column :plans, :emails, :integer
    add_column :plans, :additional_price_cents, :integer
    add_column :plans, :additional_contacts, :integer
    add_column :plans, :additional_emails, :integer
    add_column :plans, :category, :string
  end
end

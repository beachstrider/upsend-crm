class AddCcolumnsToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :plans, :plan_type, :string
    add_column :plans, :parent_stripe_plan_id, :string
    add_column :plans, :amount_decimal, :decimal
  end
end

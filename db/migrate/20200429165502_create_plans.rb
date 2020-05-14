class CreatePlans < ActiveRecord::Migration[6.0]
  def change
    create_table :plans do |t| 
      t.string :name
      t.integer :interval
      t.integer :amount_cents
      t.string :amount_currency
      t.integer :trial_days
      t.string :stripe_plan_id 
      t.string :stripe_product_id 
      t.integer :seats
      t.timestamps
    end
  end
end

class CreateSubscriptions < ActiveRecord::Migration[6.0]

  def change
    create_table :subscriptions do |t|

      t.string :status
      t.boolean :is_active
      t.integer :agent_id
      t.integer :app_id
      t.integer :plan_id
      t.string :stripe_customer_id
      # t.string :plan_name
      # t.string :plan_interval
      # t.string :plan_amount
      # t.string :plan_currency
      #t.string :stripe_plan_id  
      t.string :stripe_subscription_id
      t.string :current_period_start
      t.string :current_period_end
      t.string :canceled_at
      t.string :start
      t.integer :payment_type_cd, :default => 0
      t.datetime :payment_ends_on
      t.boolean :stop_billing, default: false
      t.string :last4
      t.string :cardholder_name
      t.string :card_type
      t.text :comments
      t.timestamps
    end
      add_index :subscriptions, :stripe_customer_id
      add_index :subscriptions, :plan_id
      add_index :subscriptions, :stripe_subscription_id
  end
end

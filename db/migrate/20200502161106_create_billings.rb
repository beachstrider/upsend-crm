class CreateBillings < ActiveRecord::Migration[6.0]
  def change
    create_table :billings do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :address
      t.integer :app_id
      t.string :stripe_customer_id
      t.string :stripe_card_id

      t.timestamps
    end
  end
end

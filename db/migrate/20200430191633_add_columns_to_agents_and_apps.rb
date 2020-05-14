class AddColumnsToAgentsAndApps < ActiveRecord::Migration[6.0]
  def change
    add_column :agents, :stripe_customer_id, :string
    add_column :agents, :stripe_card_id, :string
    add_column :apps, :stripe_customer_id, :string
    add_column :apps, :stripe_card_id, :string
  end
end

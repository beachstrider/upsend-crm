class AddSubdomainToAppsAndIdentityToAgents < ActiveRecord::Migration[6.0]
  def change
    add_column :apps, :upsend_subdomain_key, :string
    add_column :agents, :upsend_email_key, :string
  end
end

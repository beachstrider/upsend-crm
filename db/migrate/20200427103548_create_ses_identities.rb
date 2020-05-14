class CreateSesIdentities < ActiveRecord::Migration[6.0]
  def change
    create_table :ses_identities do |t|
      t.string :address 
      t.string :identity_type
      t.string :status
      t.string :verification_token
      t.text :dkim_tokens
      t.integer :agent_id
      t.integer :app_id
      t.timestamps
    end
  end
end

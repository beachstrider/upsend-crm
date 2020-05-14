module Mutations 
  class SesIdentities::UpdateSesIdentity < Mutations::BaseMutation  
    field :ses_identity, Types::JsonType, null: false
    field :errors, Types::JsonType, null: true 

    argument :app_key, String, required: true  
    argument :id, String, required: true
    argument :status, String, required: true 
    argument :address, String, required: true 

    def resolve(app_key:, id:, status:, address:)
      current_user = context[:current_user]
      @app = current_user.apps.find_by(key: app_key)   
      @ses_identity = @app.ses_identities.find(id)

      if @ses_identity && @ses_identity.address.strip.downcase == address.strip.downcase
        @ses_identity.update(status: status)
      else
        @ses_identity.errors.add(:base, "Unable to update the status for the selected domain.")
      end

      { ses_identity: @ses_identity, errors: @ses_identity.errors }
    end
  end
end 
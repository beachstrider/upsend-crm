module Mutations
  class SesIdentities::DeleteSesIdentity < Mutations::BaseMutation

    field :ses_identity, Types::JsonType, null: false
    field :errors, Types::JsonType, null: true 

    #argument :app_key, String, required: false  
    argument :id, Integer, required: true

    def resolve(id:)
      current_user = context[:current_user]
      #@app = current_user.apps.find_by(key: app_key)
      @ses_identity = current_user.ses_identities.find(id)
      if @ses_identity.delete_from_aws
        @ses_identity.delete
      end
      { ses_identity: @ses_identity, errors: @ses_identity.errors }
    end


  end
end

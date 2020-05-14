# frozen_string_literal: true

module Mutations
  class UpdateAccountDetails < Mutations::BaseMutation
    field :user_session, Types::UserType, null: false
    field :errors, Types::JsonType, null: true
    argument :app_key, String, required: true
    argument :options, Types::JsonType, required: true

    def resolve(app_key:, options:)
      app = current_user.apps.find_by(key: app_key)

      permitted_options = options.permit(
        ["name", "email", "password", "current_password"]
      )

      current_user.update_with_password(permitted_options) 
      { user_session: current_user, errors: current_user.errors }
    end

    def current_user
      context[:current_user]
    end
  end
end
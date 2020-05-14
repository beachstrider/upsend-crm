# frozen_string_literal: true

module Mutations
  class Apps::CreateSubscription < Mutations::BaseMutation
    # TODO: define return fields
    # field :post, Types::PostType, null: false

 
    field :app, Types::AppType, null: false
    field :subscription, Types::JsonType, null: true
    field :plan, Types::JsonType, null: true
    field :errors, Types::JsonType, null: true

    argument :app_key, String, required: true
    argument :token, String, required: true
    argument :plan, String, required: true
    argument :billing_params, Types::JsonType, required: false

    def resolve(app_key:, plan:, token:, billing_params:)
      billing_params = billing_params.permit(:first_name, :last_name, :email)
      current_user = context[:current_user] 
      @app = current_user.apps.find_by(key: app_key)
      @app.payment_method_id = token
      selected_plan = Plan.find(plan)
      p app_key
      p plan
      p token
      p billing_params
      p current_user
      @app.upgrade_plan(current_user, selected_plan, billing_params) 
      p @app.errors

      { app: @app.reload, subscription: @app.active_subscription, plan: @app.active_plan , errors: @app.errors.full_messages.to_sentence }
    end


  end
end

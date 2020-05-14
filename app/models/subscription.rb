class Subscription < ApplicationRecord
  belongs_to :plan, optional: true
end

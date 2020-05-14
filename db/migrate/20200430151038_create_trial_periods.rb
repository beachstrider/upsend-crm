class CreateTrialPeriods < ActiveRecord::Migration[6.0]
  def change
    create_table :trial_periods do |t|
      t.datetime :start
      t.datetime :end
      t.boolean :active
      t.boolean :trial_extended
      t.integer :days
      t.integer :app_id 
      t.timestamps
    end
  end
end

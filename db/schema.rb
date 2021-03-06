# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140707184004) do

  create_table "book_templates", force: true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "file_path"
  end

  create_table "books", force: true do |t|
    t.string   "title"
    t.string   "book_template"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "file_path"
    t.string   "total_pages"
    t.string   "origin"
    t.string   "pdf_version"
    t.string   "metadata"
    t.string   "images_path"
    t.string   "attachment_path"
    t.integer  "default_width"
    t.integer  "default_height"
    t.string   "temp_link"
    t.text     "configurations"
  end

  create_table "galleries", force: true do |t|
    t.string   "name"
    t.integer  "book_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "galleries", ["book_id"], name: "index_galleries_on_book_id"

  create_table "gallery_images", force: true do |t|
    t.string   "file_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "publishers", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

  create_table "widgets", force: true do |t|
    t.string   "title"
    t.string   "full_path"
    t.integer  "book_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "configuration"
    t.string   "parameter"
  end

  add_index "widgets", ["book_id"], name: "index_widgets_on_book_id"

end

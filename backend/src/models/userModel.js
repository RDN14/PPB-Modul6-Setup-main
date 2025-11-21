import { supabase } from "../config/supabaseClient.js";

const TABLE = "users";

export const UserModel = {
  /**
   * Find user by email
   * @param {string} email
   * @returns {Object|null} User object with password_hash or null
   */
  async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("id, email, password_hash, name, created_at")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Find user by ID
   * @param {string} id - UUID
   * @returns {Object|null} User object without password_hash
   */
  async findById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("id, email, name, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Create new user
   * @param {Object} payload - { email, password_hash, name }
   * @returns {Object} Created user without password_hash
   */
  async create(payload) {
    const { email, password_hash, name } = payload;

    const { data, error } = await supabase
      .from(TABLE)
      .insert({ email, password_hash, name })
      .select("id, email, name, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        throw new Error("Email already exists");
      }
      throw error;
    }
    return data;
  },
};

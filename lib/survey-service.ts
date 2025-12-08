// ============================================
// SURVEY SERVICE - Database operations
// ============================================

import { getSupabaseClient } from "./supabase/client"
import { getSupabaseAdminClient } from "./supabase/server"
import type { Survey, SurveyFormData } from "./types"

// Client-side: Submit survey baru
export async function submitSurvey(data: SurveyFormData): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("surveys").insert([data])

  if (error) {
    console.error("Error submitting survey:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

// Server-side: Ambil semua survey untuk dashboard
export async function getAllSurveys(): Promise<Survey[]> {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.from("surveys").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching surveys:", error)
    return []
  }
  return data || []
}

// Server-side: Ambil survey dengan pagination
export async function getSurveysPaginated(page = 1, limit = 10) {
  const supabase = getSupabaseAdminClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("surveys")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching surveys:", error)
    return { data: [], total: 0 }
  }
  return { data: data || [], total: count || 0 }
}

// Server-side: Hapus survey
export async function deleteSurvey(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from("surveys").delete().eq("id", id)

  if (error) {
    console.error("Error deleting survey:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

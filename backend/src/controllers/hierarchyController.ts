import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

// ==========================================
// 1. INVESTORS (Chủ đầu tư)
// ==========================================
export const getInvestors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("investors")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createInvestor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const { data, error } = await supabaseAdmin
      .from("investors")
      .insert([{ name, description }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateInvestor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const { data, error } = await supabaseAdmin
      .from("investors")
      .update({ name, description })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteInvestor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from("investors")
      .delete()
      .eq("id", id);
    if (error) throw error;
    res
      .status(200)
      .json({
        status: "success",
        message: "Xóa chủ đầu tư thành công (đã áp dụng cascade)",
      });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ==========================================
// 2. PROJECTS (Dự án)
// ==========================================
export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select(`*, investors(name)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { investor_id, name, description } = req.body;
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([{ investor_id, name, description }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { investor_id, name, description } = req.body;
    const { data, error } = await supabaseAdmin
      .from("projects")
      .update({ investor_id, name, description })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) throw error;
    res
      .status(200)
      .json({ status: "success", message: "Xóa dự án thành công" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ==========================================
// 3. ZONES (Phân khu)
// ==========================================
export const getZones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("zones")
      .select(`*, projects(name)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createZone = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { project_id, name } = req.body;
    const { data, error } = await supabaseAdmin
      .from("zones")
      .insert([{ project_id, name }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateZone = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { project_id, name } = req.body;
    const { data, error } = await supabaseAdmin
      .from("zones")
      .update({ project_id, name })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteZone = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from("zones").delete().eq("id", id);
    if (error) throw error;
    res
      .status(200)
      .json({ status: "success", message: "Xóa phân khu thành công" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

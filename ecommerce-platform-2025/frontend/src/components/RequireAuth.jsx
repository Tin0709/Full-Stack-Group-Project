/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin
# ID: s3988418
*/

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { me } from "../services/authService";
import { setUser } from "../redux/slices/userSlice";

export default function RequireAuth({ children, roles }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((s) => s.user.user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) {
        try {
          const u = await me();
          if (mounted && u) dispatch(setUser(u));
        } catch {
          // not logged in
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, dispatch]);

  if (loading)
    return <div className="container py-5 text-center">Loading…</div>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

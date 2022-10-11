import React from "react";
import { AuthPage, AuthProvider, Refine } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import { Layout } from "./componets/Layout";
import { PostList } from "./pages/posts/list";
import { DashboardPage } from "./pages/dashboard";
import axios from "axios";

import client from "./shared/client";
import couponDataProvider from "./dataProviders/coupons";
import { CouponList } from "./pages/coupons/list";
import { CouponShow } from "./pages/coupons/show";

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const resp = await axios.post("/api/oauth/token", {
      username: email,
      password,
      grantType: "password",
    });
    const { access_token, refresh_token, refresh_expires_in } = resp.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem(
      "refresh_token_expires_at",
      String(refresh_expires_in * 1000 + new Date().getTime())
    );
    return Promise.resolve();
  },
  register: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  updatePassword: () => Promise.resolve(),
  logout: () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("refresh_token_expires_at");
    } catch (e) {
      console.log(e);
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token_expires_at = localStorage.getItem(
      "refresh_token_expires_at"
    );
    if (
      access_token &&
      Number(refresh_token_expires_at) > new Date().getTime()
    ) {
      return Promise.resolve();
    }
    return Promise.reject();
  },
  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
  getUserIdentity: () => Promise.resolve(),
};

export function App() {
  return (
    <>
      <Refine
        routerProvider={routerProvider}
        dataProvider={{
          coupons: couponDataProvider(
            "https://admin.projectlion.io/admin/api/coupons",
            client
          ),
          posts: dataProvider("https://api.fake-rest.refine.dev"),
        }}
        resources={[
          {
            name: "posts",
            list: PostList,
          },
          {
            name: "coupons",
            list: CouponList,
            show: CouponShow,
          },
        ]}
        authProvider={authProvider}
        LoginPage={AuthPage}
        DashboardPage={DashboardPage}
        Layout={Layout}
      />
    </>
  );
}

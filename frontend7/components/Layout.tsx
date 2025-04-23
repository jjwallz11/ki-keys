// frontend6/components/Layout.tsx

import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { logout } from "@/utils/logout";

const navLinks = [
  { title: "Home", route: "/home" },
  { title: "Inventory", route: "/inventory" },
  { title: "Invoices", route: "/invoices" },
  { title: "Add Keys", route: "/upload-pdf"},
  { title: "Vin Scan", route: "/vinScan" },
  { title: "Companies", route: "/companies" },
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require("../public/pkLogo.png")} style={styles.logo} />
          <Text style={styles.appText}>The App*</Text>
        </View>
        <TouchableOpacity style={styles.logoutSection} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Nav */}
      <View style={styles.nav}>
        {navLinks.map((link) => (
          <TouchableOpacity
            key={link.route}
            onPress={() => router.push(link.route)}
          >
            <Text
              style={[
                styles.navLink,
                pathname === link.route && styles.navLinkActive,
              ]}
            >
              {link.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Page Body */}
      <View style={styles.body}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerText}>© 2025 Patriotic Keys, Inc.</Text>
          <Text style={styles.footerText}>About Us</Text>
          <Text style={styles.footerText}>Contact</Text>
        </View>
        <Image source={require("../public/jp3.png")} style={styles.signature} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 210,
    height: 70,
    resizeMode: "contain",
  },
  appText: {
    marginLeft: 8,
    marginTop: 66,
    color: "#AE2335",
    fontSize: 14,
    fontStyle: "italic",
  },
  logoutSection: {
    marginRight: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#AE2335",
    fontSize: 16,
  },

  // NAV
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#072460",
  },
  navLink: {
    color: "#ffffff",
    fontSize: 16,
    paddingBottom: 4,
  },
  navLinkActive: {
    color: "#B31942",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#B31942",
  },

  // BODY
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  // FOOTER
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#072460",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 10,
    marginBottom: 25,
  },
  footerText: {
    color: "#ffffff",
    fontSize: 14,
    marginRight: 12,
  },
  signature: {
    width: 65,
    height: 66,
    marginRight: 10,
    padding: 0,
    resizeMode: "contain",
  },
});

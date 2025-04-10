import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
// import { FiUser } from "react-icons/fi";
import { logout } from "@/utils/logout";

const navLinks = [
  { title: "Home", route: "/home" },
  { title: "Inventory", route: "/inventory" },
  { title: "Invoices", route: "/invoices" },
  { title: "Keys", route: "/keys" },
  { title: "Vehicles", route: "/vinScan" },
  { title: "Companies", route: "/companies" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: "/pkLogo.png" }} style={styles.logo} />
          <Text style={styles.appText}>The App*</Text>
        </View>

        <TouchableOpacity style={styles.logoutSection} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Nav */}
      <View style={styles.nav}>
        {navLinks.map((link) => (
          <TouchableOpacity key={link.route} onPress={() => router.push(link.route)}>
            <Text style={[styles.navLink, pathname === link.route && styles.navLinkActive]}>
              {link.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Page content */}
      <View style={styles.body}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Patriotic Keys, Inc.</Text>
        <Text style={styles.footerText}>About Us</Text>
        <Text style={styles.footerText}>Contact</Text>
        <Image source={{ uri: "/jp3.png" }} style={styles.signature} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 120, height: 40, resizeMode: "contain" },
  appText: { marginLeft: 8, color: "#AE2335", fontSize: 14, fontStyle: "italic" },

  logoutSection: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoutText: { color: "#AE2335", fontSize: 16 },

  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#072460",
  },
  navLink: {
    color: "#fff",
    fontSize: 16,
  },
  navLinkActive: {
    color: "#B31942",
    fontWeight: "bold",
  },

  body: {
    flex: 1,
    padding: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "#072460",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
    marginHorizontal: 6,
  },
  signature: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
<View style={styles.avatar}>
  <Text style={styles.avatarText}>
    {displayName.charAt(0)}
  </Text>
</View>
      </View >

      <Text style={styles.label}>Nombre</Text>
      <Text style={styles.value}>{displayName}</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user.email}</Text>
    </View >

    <View style={{ marginTop: 12 }} />
    <Button text="Cerrar sesión" type="danger" onPress={signOut} />

  </View >
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5fb",
    padding: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 32,
    color: "#111827",
    textAlign: "center",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3da1ffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 5,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
    marginBottom: 2,
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  buttonRow: {
    marginTop: 8,
    alignItems: "center",
  },
});

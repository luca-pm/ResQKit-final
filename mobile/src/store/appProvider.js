import { useCallback, useEffect, useMemo, useState } from "react";
import { useNetworkState } from "expo-network";

import AppContext from "./appContext";
import i18n from "../localization/i18n";
import {
  DEFAULT_CONSENT,
  DEFAULT_SAFETY_PROFILE,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  appendInstitutionalLog,
  closeAndRetainIncident,
  deleteRetainedIncident,
  loadAppData,
  getJSON,
  newIncident,
  newVictim,
  removeKey,
  setJSON,
} from "../services/storageService";
import { getAuthToken } from "../services/apiClient";
import * as authService from "../services/authService";

const EMPTY_USER = { firstName: "", lastName: "", email: "", profilePicture: null };

function backendUserToLocal(backendUser, fallback = EMPTY_USER) {
  if (!backendUser) return fallback;
  const parts = (backendUser.name || "").trim().split(/\s+/).filter(Boolean);
  return {
    ...fallback,
    id: backendUser.id,
    email: backendUser.email || fallback.email,
    firstName: parts[0] || fallback.firstName || "",
    lastName: parts.slice(1).join(" ") || fallback.lastName || "",
    name: backendUser.name || "",
    role: backendUser.role || "user",
  };
}

export default function AppProvider({ children }) {
  const networkState = useNetworkState();
  const online = networkState.isInternetReachable ?? networkState.isConnected ?? true;

  const [user, setUserState] = useState(EMPTY_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [consent, setConsentState] = useState(DEFAULT_CONSENT);
  const [safetyProfile, setSafetyProfileState] = useState(DEFAULT_SAFETY_PROFILE);
  const [settings, setSettingsState] = useState(DEFAULT_SETTINGS);
  const [incident, setIncidentState] = useState(null);
  const [retainedIncidents, setRetainedIncidents] = useState([]);
  const [institutionalLog, setInstitutionalLog] = useState([]);
  const [aiNavigationAction, setAiNavigationAction] = useState(null);
  const [aiConversationScope, setAiConversationScope] = useState("general");
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const data = await loadAppData();
      const savedUser = await getJSON(STORAGE_KEYS.user, EMPTY_USER);
      if (!alive) return;
      setConsentState(data.consent || DEFAULT_CONSENT);
      setSafetyProfileState(data.safetyProfile || DEFAULT_SAFETY_PROFILE);
      setSettingsState(data.settings || DEFAULT_SETTINGS);
      setIncidentState(data.incident || null);
      setRetainedIncidents(data.retained || []);
      setInstitutionalLog(data.institutionalLog || []);
      setUserState(savedUser || EMPTY_USER);
      if (data.settings?.uiLanguage) void i18n.changeLanguage(data.settings.uiLanguage);
      setAppReady(true);

      const token = await getAuthToken();
      if (!alive) return;
      if (!token) {
        setIsLoggedIn(false);
        setAuthReady(true);
        return;
      }
      try {
        const backendUser = await authService.getCurrentUser();
        if (!alive) return;
        const local = backendUserToLocal(backendUser, savedUser || EMPTY_USER);
        setUserState(local);
        await setJSON(STORAGE_KEYS.user, local);
        setIsLoggedIn(true);
      } catch {
        // Păstrăm sesiunea locală dacă telefonul este offline; token-ul rămâne sursa de adevăr
        // până când backend-ul poate fi contactat din nou.
        if (alive) setIsLoggedIn(Boolean(token));
      } finally {
        if (alive) setAuthReady(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  const setUser = useCallback((value) => {
    setUserState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      void setJSON(STORAGE_KEYS.user, next);
      return next;
    });
  }, []);

  const updateConsent = useCallback((patch) => {
    setConsentState((prev) => {
      const next = { ...prev, ...patch };
      void setJSON(STORAGE_KEYS.consent, next);
      return next;
    });
  }, []);

  const updateSafetyProfile = useCallback((patch) => {
    setSafetyProfileState((prev) => {
      const next = { ...prev, ...patch };
      void setJSON(STORAGE_KEYS.safetyProfile, next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettingsState((prev) => {
      const next = {
        ...prev,
        ...patch,
        notifications: patch.notifications ? { ...prev.notifications, ...patch.notifications } : prev.notifications,
      };
      void setJSON(STORAGE_KEYS.settings, next);
      if (patch.uiLanguage) void i18n.changeLanguage(patch.uiLanguage);
      return next;
    });
  }, []);

  const startIncident = useCallback(() => {
    const fresh = newIncident();
    setIncidentState(fresh);
    void setJSON(STORAGE_KEYS.incident, fresh);
    return fresh;
  }, []);

  const updateIncident = useCallback((patch) => {
    setIncidentState((prev) => {
      const base = prev || newIncident();
      const update = typeof patch === "function" ? patch(base) : patch;
      const next = { ...base, ...update, updatedAt: new Date().toISOString() };
      void setJSON(STORAGE_KEYS.incident, next);
      return next;
    });
  }, []);

  const addVictim = useCallback(() => {
    setIncidentState((prev) => {
      const base = prev || newIncident();
      const victim = newVictim(base.victims.length);
      const next = { ...base, victims: [...base.victims, victim], activeVictimId: victim.id, updatedAt: new Date().toISOString() };
      void setJSON(STORAGE_KEYS.incident, next);
      return next;
    });
  }, []);

  const updateVictim = useCallback((victimId, patch) => {
    updateIncident((base) => ({
      victims: base.victims.map((victim) => victim.id === victimId ? { ...victim, ...patch } : victim),
    }));
  }, [updateIncident]);

  const updateActiveVictim = useCallback((patch) => {
    updateIncident((base) => ({
      victims: base.victims.map((victim) => victim.id === base.activeVictimId ? { ...victim, ...patch } : victim),
    }));
  }, [updateIncident]);

  const selectVictim = useCallback((victimId) => updateIncident({ activeVictimId: victimId }), [updateIncident]);

  const discardIncident = useCallback(() => {
    setIncidentState(null);
    void removeKey(STORAGE_KEYS.incident);
  }, []);

  const closeIncident = useCallback(async () => {
    const current = incident;
    setIncidentState(null);
    const retained = await closeAndRetainIncident(current, settings.retention);
    setRetainedIncidents(retained);
  }, [incident, settings.retention]);

  const deleteRetained = useCallback(async (id) => {
    const next = await deleteRetainedIncident(id);
    setRetainedIncidents(next);
  }, []);

  const logInstitutional = useCallback((entry) => {
    const full = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: new Date().toISOString(),
    };
    setInstitutionalLog((prev) => {
      const next = [...prev, full].slice(-100);
      void appendInstitutionalLog(full);
      return next;
    });
  }, []);

  const clearInstitutionalLog = useCallback(() => {
    setInstitutionalLog([]);
    void removeKey(STORAGE_KEYS.institutionalLog);
  }, []);

  const clearAiNavigationAction = useCallback(() => {
    setAiNavigationAction(null);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const backendUser = await authService.login(email, password);
    const local = backendUserToLocal(backendUser, user);
    setUser(local);
    setIsLoggedIn(true);
    return local;
  }, [setUser, user]);

  const signUp = useCallback(async ({ email, password, firstName, lastName }) => {
    const name = `${firstName || ""} ${lastName || ""}`.trim();
    const backendUser = await authService.register({ email, password, name });
    const local = backendUserToLocal(backendUser, { ...user, firstName, lastName, email });
    setUser(local);
    setIsLoggedIn(true);
    return local;
  }, [setUser, user]);

  const signOut = useCallback(async () => {
    await authService.logout();
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(() => ({
    user, setUser,
    isLoggedIn, setIsLoggedIn,
    authReady, appReady, online,
    consent, updateConsent,
    safetyProfile, updateSafetyProfile,
    settings, updateSettings,
    incident, startIncident, updateIncident, addVictim, updateVictim, updateActiveVictim, selectVictim, discardIncident, closeIncident,
    retainedIncidents, deleteRetained,
    institutionalLog, logInstitutional, clearInstitutionalLog,
    aiNavigationAction, setAiNavigationAction, clearAiNavigationAction,
    aiConversationScope, setAiConversationScope,
    signIn, signUp, signOut,
  }), [
    user, setUser, isLoggedIn, authReady, appReady, online,
    consent, updateConsent, safetyProfile, updateSafetyProfile, settings, updateSettings, incident,
    startIncident, updateIncident, addVictim, updateVictim, updateActiveVictim, selectVictim, discardIncident, closeIncident,
    retainedIncidents, deleteRetained, institutionalLog, logInstitutional, clearInstitutionalLog,
    aiNavigationAction, clearAiNavigationAction, aiConversationScope, signIn, signUp, signOut,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

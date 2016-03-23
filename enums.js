// https://developer.gnome.org/NetworkManager/unstable/spec.html

var enums = module.exports

enums.values = function(group) {
  return Object.keys(group).map(function(key) {
    return enums[group][key] || enums[group][key.toString()]
  })
}

var mapping = {
  'org.freedesktop.NetworkManager': {
    Metered:      'NM_METERED',
    Connectivity: 'NM_CONNECTIVITY',
  },
  'org.freedesktop.NetworkManager.AccessPoint': {
    Flags:      'NM_802_11_AP_FLAGS',
    WpaFlags:   'NM_802_11_AP_SEC',
    RsnFlags:   'NM_802_11_AP_SEC',
    Mode:       'NM_802_11_MODE',
  },
  'org.freedesktop.NetworkManager.Device': {
    Capabilities: 'NM_DEVICE_CAP',
    State: 'NM_DEVICE_STATE',
    StateReason: 'NM_DEVICE_STATE_REASON_STRUCT',
    DeviceType: 'NM_DEVICE_TYPE',
    Metered: 'NM_METERED',
  },
  'org.freedesktop.NetworkManager.Device.Bluetooth': {
    BtCapabilities: 'NM_BT_CAPABILITIES',
  },
  'org.freedesktop.NetworkManager.Device.Modem': {
    ModemCapabilities: 'NM_DEVICE_MODEM_CAPABILITIES',
    CurrentCapabilities: 'NM_DEVICE_MODEM_CAPABILITIES',
  },
  'org.freedesktop.NetworkManager.Device.Wireless': {
    Mode: 'NM_802_11_MODE',
    WirelessCapabilities: 'NM_802_11_DEVICE_CAP',
  },
  'org.freedesktop.NetworkManager.WiMax.Nsp': {
    NetworkType: 'NM_WIMAX_NSP_NETWORK_TYPE',
  },
  'org.freedesktop.NetworkManager.Connection.Active': {
    State: 'NM_ACTIVE_CONNECTION_STATE',
  },
  'org.freedesktop.NetworkManager.VPN.Connection': {
    VpnState: 'NM_VPN_CONNECTION_STATE',
  },
  'org.freedesktop.NetworkManager.VPN.Plugin': {
    State: 'NM_VPN_SERVICE_STATE',
  }
}

enums.mapping = mapping

enums.interfaces = {
  'NetworkManager':       'org.freedesktop.NetworkManager',
  'AccessPoint':          'org.freedesktop.NetworkManager.AccessPoint',
  'Device':               'org.freedesktop.NetworkManager.Device',
  'DeviceAdsl':           'org.freedesktop.NetworkManager.Device.Adsl',
  'DeviceBond':           'org.freedesktop.NetworkManager.Device.Bond',
  'DeviceBridge':         'org.freedesktop.NetworkManager.Device.Bridge',
  'DeviceBluetooth':      'org.freedesktop.NetworkManager.Device.Bluetooth',
  'DeviceWired':          'org.freedesktop.NetworkManager.Device.Wired',
  'DeviceGeneric':        'org.freedesktop.NetworkManager.Device.Generic',
  'DeviceInfiniband':     'org.freedesktop.NetworkManager.Device.Infiniband',
  'DeviceIPTunnel':       'org.freedesktop.NetworkManager.Device.IPTunnel',
  'DeviceMacvlan':        'org.freedesktop.NetworkManager.Device.Macvlan',
  'DeviceModem':          'org.freedesktop.NetworkManager.Device.Modem',
  'DeviceOlpcMesh':       'org.freedesktop.NetworkManager.Device.OlpcMesh',
  'DeviceTeam':           'org.freedesktop.NetworkManager.Device.Team',
  'DeviceTun':            'org.freedesktop.NetworkManager.Device.Tun',
  'DeviceVeth':           'org.freedesktop.NetworkManager.Device.Veth',
  'DeviceVlan':           'org.freedesktop.NetworkManager.Device.Vlan',
  'DeviceVxlan':          'org.freedesktop.NetworkManager.Device.Vxlan',
  'DeviceWireless':       'org.freedesktop.NetworkManager.Device.Wireless',
  'DeviceWiMax':          'org.freedesktop.NetworkManager.Device.WiMax',
  'WiMaxNsp':             'org.freedesktop.NetworkManager.WiMax.Nsp',
  'IP4Config':            'org.freedesktop.NetworkManager.IP4Config',
  'IP6Config':            'org.freedesktop.NetworkManager.IP6Config',
  'DHCP4Config':          'org.freedesktop.NetworkManager.DHCP4Config',
  'DHCP6Config':          'org.freedesktop.NetworkManager.DHCP6Config',
  'Settings':             'org.freedesktop.NetworkManager.Settings',
  'SettingsConnection':   'org.freedesktop.NetworkManager.Settings.Connection',
  'ConnectionActive':     'org.freedesktop.NetworkManager.Connection.Active',
  'AgentManager':         'org.freedesktop.NetworkManager.AgentManager',
  'SecretAgent':          'org.freedesktop.NetworkManager.SecretAgent',
  'VPNConnection':        'org.freedesktop.NetworkManager.VPN.Connection',
  'VPNPlugin':            'org.freedesktop.NetworkManager.VPN.Plugin',
}

enums.NM_STATE = {
  // Networking state is unknown.
  0: 'NM_STATE_UNKNOWN',
  // Networking is inactive and all devices are disabled.
  10: 'NM_STATE_ASLEEP',
  // There is no active network connection.
  20: 'NM_STATE_DISCONNECTED',
  // Network connections are being cleaned up.
  30: 'NM_STATE_DISCONNECTING',
  // A network device is connecting to a network and there is no other available network connection.
  40: 'NM_STATE_CONNECTING',
  // A network device is connected, but there is only link-local connectivity.
  50: 'NM_STATE_CONNECTED_LOCAL',
  // A network device is connected, but there is only site-local connectivity.
  60: 'NM_STATE_CONNECTED_SITE',
  // A network device is connected, with global network connectivity.
  70: 'NM_STATE_CONNECTED_GLOBAL',
}

enums.NM_CONNECTIVITY = {
  // Network connectivity is unknown.
  0: 'NM_CONNECTIVITY_UNKNOWN',
  // The host is not connected to any network.
  1: 'NM_CONNECTIVITY_NONE',
  // The host is behind a captive portal and cannot reach the full Internet.
  2: 'NM_CONNECTIVITY_PORTAL',
  // The host is connected to a network, but does not appear to be able to reach the full Internet.
  3: 'NM_CONNECTIVITY_LIMITED',
  // The host is connected to a network, and appears to be able to reach the full Internet
  4: 'NM_CONNECTIVITY_FULL',
}

enums.NM_802_11_AP_FLAGS = {
  // Null capability - says nothing about the access point.
  '0x0': 'NM_802_11_AP_FLAGS_NONE',
  // Access point supports privacy measures.
  '0x1': 'NM_802_11_AP_FLAGS_PRIVACY',
}

enums.NM_802_11_AP_SEC = {
  // Null flag.
  '0x0': 'NM_802_11_AP_SEC_NONE',
  // Access point supports pairwise 40-bit WEP encryption.
  '0x1': 'NM_802_11_AP_SEC_PAIR_WEP40',
  // Access point supports pairwise 104-bit WEP encryption.
  '0x2': 'NM_802_11_AP_SEC_PAIR_WEP104',
  // Access point supports pairwise TKIP encryption.
  '0x4': 'NM_802_11_AP_SEC_PAIR_TKIP',
  // Access point supports pairwise CCMP encryption.
  '0x8': 'NM_802_11_AP_SEC_PAIR_CCMP',
  // Access point supports a group 40-bit WEP cipher.
  '0x10': 'NM_802_11_AP_SEC_GROUP_WEP40',
  // Access point supports a group 104-bit WEP cipher.
  '0x20': 'NM_802_11_AP_SEC_GROUP_WEP104',
  // Access point supports a group TKIP cipher.
  '0x40': 'NM_802_11_AP_SEC_GROUP_TKIP',
  // Access point supports a group CCMP cipher.
  '0x80': 'NM_802_11_AP_SEC_GROUP_CCMP',
  // Access point supports PSK key management.
  '0x100': 'NM_802_11_AP_SEC_KEY_MGMT_PSK',
  // Access point supports 802.1x key management.
  '0x200': 'NM_802_11_AP_SEC_KEY_MGMT_802_1X',
}

enums.NM_DEVICE_STATE = {
  // The device is in an unknown state.
  '0': 'NM_DEVICE_STATE_UNKNOWN',
  // The device is recognized but not managed by NetworkManager.
  '10': 'NM_DEVICE_STATE_UNMANAGED',
  // The device cannot be used (carrier off, rfkill, etc).
  '20': 'NM_DEVICE_STATE_UNAVAILABLE',
  // The device is not connected.
  '30': 'NM_DEVICE_STATE_DISCONNECTED',
  // The device is preparing to connect.
  '40': 'NM_DEVICE_STATE_PREPARE',
  // The device is being configured.
  '50': 'NM_DEVICE_STATE_CONFIG',
  // The device is awaiting secrets necessary to continue connection.
  '60': 'NM_DEVICE_STATE_NEED_AUTH',
  // The IP settings of the device are being requested and configured.
  '70': 'NM_DEVICE_STATE_IP_CONFIG',
  // The device's IP connectivity ability is being determined.
  '80': 'NM_DEVICE_STATE_IP_CHECK',
  // The device is waiting for secondary connections to be activated.
  '90': 'NM_DEVICE_STATE_SECONDARIES',
  // The device is active.
  '100': 'NM_DEVICE_STATE_ACTIVATED',
  // The device's network connection is being torn down.
  '110': 'NM_DEVICE_STATE_DEACTIVATING',
  // The device is in a failure state following an attempt to activate it.
  '120': 'NM_DEVICE_STATE_FAILED',
}

enums.NM_DEVICE_TYPE = {
  // The device type is unknown.
  '0': 'NM_DEVICE_TYPE_UNKNOWN',
  // The device is wired Ethernet device.
  '1': 'NM_DEVICE_TYPE_ETHERNET',
  // The device is an 802.11 WiFi device.
  '2': 'NM_DEVICE_TYPE_WIFI',
  // Unused
  '3': 'NM_DEVICE_TYPE_UNUSED1',
  // Unused
  '4': 'NM_DEVICE_TYPE_UNUSED2',
  // The device is Bluetooth device that provides PAN or DUN capabilities.
  '5': 'NM_DEVICE_TYPE_BT',
  // The device is an OLPC mesh networking device.
  '6': 'NM_DEVICE_TYPE_OLPC_MESH',
  // The device is an 802.16e Mobile WiMAX device.
  '7': 'NM_DEVICE_TYPE_WIMAX',
  // The device is a modem supporting one or more of analog telephone, CDMA/EVDO, GSM/UMTS/HSPA, or LTE standards to access a cellular or wireline data network.
  '8': 'NM_DEVICE_TYPE_MODEM',
  // The device is an IP-capable InfiniBand interface.
  '9': 'NM_DEVICE_TYPE_INFINIBAND',
  // The device is a bond master interface.
  '10': 'NM_DEVICE_TYPE_BOND',
  // The device is a VLAN interface.
  '11': 'NM_DEVICE_TYPE_VLAN',
  // The device is an ADSL device supporting PPPoE and PPPoATM protocols.
  '12': 'NM_DEVICE_TYPE_ADSL',
  // The device is a bridge interface.
  '13': 'NM_DEVICE_TYPE_BRIDGE',
  // The device is a generic interface type unrecognized by NetworkManager.
  '14': 'NM_DEVICE_TYPE_GENERIC',
  // The device is a team master interface.
  '15': 'NM_DEVICE_TYPE_TEAM',
}

enums.NM_DEVICE_STATE_REASON = enums.NM_DEVICE_STATE_REASON_STRUCT = {
  // The reason for the device state change is unknown.
  '0': 'NM_DEVICE_STATE_REASON_UNKNOWN',
  // The state change is normal.
  '1': 'NM_DEVICE_STATE_REASON_NONE',
  // The device is now managed.
  '2': 'NM_DEVICE_STATE_REASON_NOW_MANAGED',
  // The device is no longer managed.
  '3': 'NM_DEVICE_STATE_REASON_NOW_UNMANAGED',
  // The device could not be readied for configuration.
  '4': 'NM_DEVICE_STATE_REASON_CONFIG_FAILED',
  // IP configuration could not be reserved (no available address, timeout, etc).
  '5': 'NM_DEVICE_STATE_REASON_CONFIG_UNAVAILABLE',
  // The IP configuration is no longer valid.
  '6': 'NM_DEVICE_STATE_REASON_CONFIG_EXPIRED',
  // Secrets were required, but not provided.
  '7': 'NM_DEVICE_STATE_REASON_NO_SECRETS',
  // The 802.1X supplicant disconnected from the access point or authentication server.
  '8': 'NM_DEVICE_STATE_REASON_SUPPLICANT_DISCONNECT',
  // Configuration of the 802.1X supplicant failed.
  '9': 'NM_DEVICE_STATE_REASON_SUPPLICANT_CONFIG_FAILED',
  // The 802.1X supplicant quit or failed unexpectedly.
  '10': 'NM_DEVICE_STATE_REASON_SUPPLICANT_FAILED',
  // The 802.1X supplicant took too long to authenticate.
  '11': 'NM_DEVICE_STATE_REASON_SUPPLICANT_TIMEOUT',
  // The PPP service failed to start within the allowed time.
  '12': 'NM_DEVICE_STATE_REASON_PPP_START_FAILED',
  // The PPP service disconnected unexpectedly.
  '13': 'NM_DEVICE_STATE_REASON_PPP_DISCONNECT',
  // The PPP service quit or failed unexpectedly.
  '14': 'NM_DEVICE_STATE_REASON_PPP_FAILED',
  // The DHCP service failed to start within the allowed time.
  '15': 'NM_DEVICE_STATE_REASON_DHCP_START_FAILED',
  // The DHCP service reported an unexpected error.
  '16': 'NM_DEVICE_STATE_REASON_DHCP_ERROR',
  // The DHCP service quit or failed unexpectedly.
  '17': 'NM_DEVICE_STATE_REASON_DHCP_FAILED',
  // The shared connection service failed to start.
  '18': 'NM_DEVICE_STATE_REASON_SHARED_START_FAILED',
  // The shared connection service quit or failed unexpectedly.
  '19': 'NM_DEVICE_STATE_REASON_SHARED_FAILED',
  // The AutoIP service failed to start.
  '20': 'NM_DEVICE_STATE_REASON_AUTOIP_START_FAILED',
  // The AutoIP service reported an unexpected error.
  '21': 'NM_DEVICE_STATE_REASON_AUTOIP_ERROR',
  // The AutoIP service quit or failed unexpectedly.
  '22': 'NM_DEVICE_STATE_REASON_AUTOIP_FAILED',
  // Dialing failed because the line was busy.
  '23': 'NM_DEVICE_STATE_REASON_MODEM_BUSY',
  // Dialing failed because there was no dial tone.
  '24': 'NM_DEVICE_STATE_REASON_MODEM_NO_DIAL_TONE',
  // Dialing failed because there was carrier.
  '25': 'NM_DEVICE_STATE_REASON_MODEM_NO_CARRIER',
  // Dialing timed out.
  '26': 'NM_DEVICE_STATE_REASON_MODEM_DIAL_TIMEOUT',
  // Dialing failed.
  '27': 'NM_DEVICE_STATE_REASON_MODEM_DIAL_FAILED',
  // Modem initialization failed.
  '28': 'NM_DEVICE_STATE_REASON_MODEM_INIT_FAILED',
  // Failed to select the specified GSM APN.
  '29': 'NM_DEVICE_STATE_REASON_GSM_APN_FAILED',
  // Not searching for networks.
  '30': 'NM_DEVICE_STATE_REASON_GSM_REGISTRATION_NOT_SEARCHING',
  // Network registration was denied.
  '31': 'NM_DEVICE_STATE_REASON_GSM_REGISTRATION_DENIED',
  // Network registration timed out.
  '32': 'NM_DEVICE_STATE_REASON_GSM_REGISTRATION_TIMEOUT',
  // Failed to register with the requested GSM network.
  '33': 'NM_DEVICE_STATE_REASON_GSM_REGISTRATION_FAILED',
  // PIN check failed.
  '34': 'NM_DEVICE_STATE_REASON_GSM_PIN_CHECK_FAILED',
  // Necessary firmware for the device may be missing.
  '35': 'NM_DEVICE_STATE_REASON_FIRMWARE_MISSING',
  // The device was removed.
  '36': 'NM_DEVICE_STATE_REASON_REMOVED',
  // NetworkManager went to sleep.
  '37': 'NM_DEVICE_STATE_REASON_SLEEPING',
  // The device's active connection was removed or disappeared.
  '38': 'NM_DEVICE_STATE_REASON_CONNECTION_REMOVED',
  // A user or client requested the disconnection.
  '39': 'NM_DEVICE_STATE_REASON_USER_REQUESTED',
  // The device's carrier/link changed.
  '40': 'NM_DEVICE_STATE_REASON_CARRIER',
  // The device's existing connection was assumed.
  '41': 'NM_DEVICE_STATE_REASON_CONNECTION_ASSUMED',
  // The 802.1x supplicant is now available.
  '42': 'NM_DEVICE_STATE_REASON_SUPPLICANT_AVAILABLE',
  // The modem could not be found.
  '43': 'NM_DEVICE_STATE_REASON_MODEM_NOT_FOUND',
  // The Bluetooth connection timed out or failed.
  '44': 'NM_DEVICE_STATE_REASON_BT_FAILED',
  // GSM Modem's SIM Card not inserted.
  '45': 'NM_DEVICE_STATE_REASON_GSM_SIM_NOT_INSERTED',
  // GSM Modem's SIM Pin required.
  '46': 'NM_DEVICE_STATE_REASON_GSM_SIM_PIN_REQUIRED',
  // GSM Modem's SIM Puk required.
  '47': 'NM_DEVICE_STATE_REASON_GSM_SIM_PUK_REQUIRED',
  // GSM Modem's SIM wrong
  '48': 'NM_DEVICE_STATE_REASON_GSM_SIM_WRONG',
  // InfiniBand device does not support connected mode.
  '49': 'NM_DEVICE_STATE_REASON_INFINIBAND_MODE',
  // A dependency of the connection failed.
  '50': 'NM_DEVICE_STATE_REASON_DEPENDENCY_FAILED',
  // Problem with the RFC 2684 Ethernet over ADSL bridge.
  '51': 'NM_DEVICE_STATE_REASON_BR2684_FAILED',
  // ModemManager was not running or quit unexpectedly.
  '52': 'NM_DEVICE_STATE_REASON_MODEM_MANAGER_UNAVAILABLE',
  // The 802.11 Wi-Fi network could not be found.
  '53': 'NM_DEVICE_STATE_REASON_SSID_NOT_FOUND',
  // A secondary connection of the base connection failed.
  '54': 'NM_DEVICE_STATE_REASON_SECONDARY_CONNECTION_FAILED',
  // DCB or FCoE setup failed.
  '55': 'NM_DEVICE_STATE_REASON_DCB_FCOE_FAILED',
  // teamd control failed.
  '56': 'NM_DEVICE_STATE_REASON_TEAMD_CONTROL_FAILED',
  // Modem failed or no longer available.
  '57': 'NM_DEVICE_STATE_REASON_MODEM_FAILED',
  // Modem now ready and available.
  '58': 'NM_DEVICE_STATE_REASON_MODEM_AVAILABLE',
  // The SIM PIN was incorrect.
  '59': 'NM_DEVICE_STATE_REASON_SIM_PIN_INCORRECT',
  // A new connection activation was enqueued.
  '60': 'NM_DEVICE_STATE_REASON_NEW_ACTIVATION',
  // The device's parent changed.
  '61': 'NM_DEVICE_STATE_REASON_PARENT_CHANGED',
  // The device parent's management changed.
  '62': 'NM_DEVICE_STATE_REASON_PARENT_MANAGED_CHANGED',
}

enums.NM_METERED = {
  // The device metered status is unknown.
  '0': 'NM_METERED_UNKNOWN',
  // The device is metered and the value was statically set.
  '1': 'NM_METERED_YES',
  // The device is not metered and the value was statically set.
  '2': 'NM_METERED_NO',
  // The device is metered and the value was guessed.
  '3': 'NM_METERED_GUESS_YES',
  // The device is not metered and the value was guessed.
  '4': 'NM_METERED_GUESS_NO',
}

enums.NM_DEVICE_CAP = {
  // Null capability.
  '0x0': 'NM_DEVICE_CAP_NONE',
  // The device is supported by NetworkManager.
  '0x1': 'NM_DEVICE_CAP_NM_SUPPORTED',
  // The device supports carrier detection.
  '0x2': 'NM_DEVICE_CAP_CARRIER_DETECT',
}

enums.NM_BT_CAPABILITIES = {
  // The device has no recognized capabilities.
  '0x0': 'NM_BT_CAPABILITY_NONE',
  // The device supports Bluetooth Dial-Up Networking.
  '0x1': 'NM_BT_CAPABILITY_DUN',
  // The device supports Bluetooth Personal Area Networking.
  '0x2': 'NM_BT_CAPABILITY_PAN',
}

enums.NM_DEVICE_MODEM_CAPABILITIES = {
  // Modem has no capabilties.
  '0x0': 'NM_DEVICE_MODEM_CAPABILITY_NONE',
  // Modem supports the analog wired telephone network (ie 56k dialup) and does not have wireless/cellular capabilities.
  '0x1': 'NM_DEVICE_MODEM_CAPABILITY_POTS',
  // Modem supports at least one of CDMA 1xRTT, EVDO revision 0, EVDO revision A, or EVDO revision B.
  '0x2': 'NM_DEVICE_MODEM_CAPABILITY_CDMA_EVDO',
  // Modem supports at least one of GSM, GPRS, EDGE, UMTS, HSDPA, HSUPA, or HSPA+ packet switched data capability.
  '0x4': 'NM_DEVICE_MODEM_CAPABILITY_GSM_UMTS',
  // Modem has at LTE data capability.
  '0x8': 'NM_DEVICE_MODEM_CAPABILITY_LTE',
}

enums.NM_802_11_DEVICE_CAP = {
  // Null capability - syntactic sugar for no capabilities supported. Do not AND this with other capabilities!
  '0x0': 'NM_802_11_DEVICE_CAP_NONE',
  // The device supports the 40-bit WEP cipher.
  '0x1': 'NM_802_11_DEVICE_CAP_CIPHER_WEP40',
  // The device supports the 104-bit WEP cipher.
  '0x2': 'NM_802_11_DEVICE_CAP_CIPHER_WEP104',
  // The device supports the TKIP cipher.
  '0x4': 'NM_802_11_DEVICE_CAP_CIPHER_TKIP',
  // The device supports the CCMP cipher.
  '0x8': 'NM_802_11_DEVICE_CAP_CIPHER_CCMP',
  // The device supports the WPA encryption/authentication protocol.
  '0x10': 'NM_802_11_DEVICE_CAP_WPA',
  // The device supports the RSN encryption/authentication protocol.
  '0x20': 'NM_802_11_DEVICE_CAP_RSN',
  // The device supports Access Point mode.
  '0x40': 'NM_802_11_DEVICE_CAP_AP',
  // The device supports Ad-Hoc mode.
  '0x80': 'NM_802_11_DEVICE_CAP_ADHOC',
  // The device properly reports information about supported frequencies and thus both NM_802_11_DEVICE_CAP_FREQ_2GHZ and NM_802_11_DEVICE_CAP_FREQ_5GHZ are valid.
  '0x100': 'NM_802_11_DEVICE_CAP_FREQ_VALID',
  // The device supports 2.4GHz frequencies.
  '0x200': 'NM_802_11_DEVICE_CAP_FREQ_2GHZ',
  // The device supports 5GHz frequencies.
  '0x400': 'NM_802_11_DEVICE_CAP_FREQ_5GHZ',
}

enums.NM_WIMAX_NSP_NETWORK_TYPE = {
  // Unknown network.
  '0x0': 'NM_WIMAX_NSP_NETWORK_TYPE_UNKNOWN',
  // Home network.
  '0x1': 'NM_WIMAX_NSP_NETWORK_TYPE_HOME',
  // Partner network.
  '0x2': 'NM_WIMAX_NSP_NETWORK_TYPE_PARTNER',
  // Roaming partner network.
  '0x3': 'NM_WIMAX_NSP_NETWORK_TYPE_ROAMING_PARTNER',
}

enums.NM_ACTIVE_CONNECTION_STATE = {
  // The active connection is in an unknown state.
  '0': 'NM_ACTIVE_CONNECTION_STATE_UNKNOWN',
  // The connection is activating.
  '1': 'NM_ACTIVE_CONNECTION_STATE_ACTIVATING',
  // The connection is activated.
  '2': 'NM_ACTIVE_CONNECTION_STATE_ACTIVATED',
  // The connection is being torn down and cleaned up.
  '3': 'NM_ACTIVE_CONNECTION_STATE_DEACTIVATING',
  // The connection is no longer active.
  '4': 'NM_ACTIVE_CONNECTION_STATE_DEACTIVATED',
}

enums.NM_SECRET_AGENT_GET_SECRETS_FLAGS = {
  // No special behavior; by default no user interaction is allowed and requests for secrets are fulfilled from persistent storage, or if no secrets are available an error is returned.
  '0x0': 'NM_SECRET_AGENT_GET_SECRETS_FLAG_NONE',
  // Allows the request to interact with the user, possibly prompting via UI for secrets if any are required, or if none are found in persistent storage.
  '0x1': 'NM_SECRET_AGENT_GET_SECRETS_FLAG_ALLOW_INTERACTION',
  // Explicitly prompt for new secrets from the user. This flag signals that NetworkManager thinks any existing secrets are invalid or wrong. This flag implies that interaction is allowed.
  '0x2': 'NM_SECRET_AGENT_GET_SECRETS_FLAG_REQUEST_NEW',
  // Set if the request was initiated by user-requested action via the D-Bus interface, as opposed to automatically initiated by NetworkManager in response to (for example) scan results or carrier changes.
  '0x4': 'NM_SECRET_AGENT_GET_SECRETS_FLAG_USER_REQUESTED',
}

enums.NM_SECRET_AGENT_CAPABILITIES = {
  // No special capabilities.
  '0x0': 'NM_SECRET_AGENT_CAPABILITY_NONE',
  // The agent supports passing hints to VPN plugin authentication dialogs.
  '0x1': 'NM_SECRET_AGENT_CAPABILITY_VPN_HINTS',
}

enums.NM_VPN_CONNECTION_STATE = {
  // The state of the VPN connection is unknown.
  '0': 'NM_VPN_CONNECTION_STATE_UNKNOWN',
  // The VPN connection is preparing to connect.
  '1': 'NM_VPN_CONNECTION_STATE_PREPARE',
  // The VPN connection needs authorization credentials.
  '2': 'NM_VPN_CONNECTION_STATE_NEED_AUTH',
  // The VPN connection is being established. FIXME: Should be CONNECTING or CONNECTED.
  '3': 'NM_VPN_CONNECTION_STATE_CONNECT',
  // The VPN connection is getting an IP address. FIXME: Should be an -ING
  '4': 'NM_VPN_CONNECTION_STATE_IP_CONFIG_GET',
  // The VPN connection is active.
  '5': 'NM_VPN_CONNECTION_STATE_ACTIVATED',
  // The VPN connection failed.
  '6': 'NM_VPN_CONNECTION_STATE_FAILED',
  // The VPN connection is disconnected.
  '7': 'NM_VPN_CONNECTION_STATE_DISCONNECTED',
}

enums.NM_VPN_CONNECTION_STATE_REASON = {
  // The reason for the VPN connection state change is unknown.
  '0': 'NM_VPN_CONNECTION_STATE_REASON_UNKNOWN',
  // No reason was given for the VPN connection state change.
  '1': 'NM_VPN_CONNECTION_STATE_REASON_NONE',
  // The VPN connection changed state because the user disconnected it.
  '2': 'NM_VPN_CONNECTION_STATE_REASON_USER_DISCONNECTED',
  // The VPN connection changed state because the device it was using was disconnected.
  '3': 'NM_VPN_CONNECTION_STATE_REASON_DEVICE_DISCONNECTED',
  // The service providing the VPN connection was stopped.
  '4': 'NM_VPN_CONNECTION_STATE_REASON_SERVICE_STOPPED',
  // The IP config of the VPN connection was invalid.
  '5': 'NM_VPN_CONNECTION_STATE_REASON_IP_CONFIG_INVALID',
  // The connection attempt to the VPN service timed out.
  '6': 'NM_VPN_CONNECTION_STATE_REASON_CONNECT_TIMEOUT',
  // A timeout occurred while starting the service providing the VPN connection.
  '7': 'NM_VPN_CONNECTION_STATE_REASON_SERVICE_START_TIMEOUT',
  // Starting the service starting the service providing the VPN connection failed.
  '8': 'NM_VPN_CONNECTION_STATE_REASON_SERVICE_START_FAILED',
  // Necessary secrets for the VPN connection were not provided.
  '9': 'NM_VPN_CONNECTION_STATE_REASON_NO_SECRETS',
  // Authentication to the VPN server failed.
  '10': 'NM_VPN_CONNECTION_STATE_REASON_LOGIN_FAILED',
  // The connection was deleted from settings.
  '11': 'NM_VPN_CONNECTION_STATE_REASON_CONNECTION_REMOVED',
}

enums.NM_VPN_SERVICE_STATE = {
  // The state of the VPN plugin is unknown.
  '0': 'NM_VPN_SERVICE_STATE_UNKNOWN',
  // The VPN plugin is initialized.
  '1': 'NM_VPN_SERVICE_STATE_INIT',
  // (Not used.)
  '2': 'NM_VPN_SERVICE_STATE_SHUTDOWN',
  // The plugin is attempting to connect to a VPN server.
  '3': 'NM_VPN_SERVICE_STATE_STARTING',
  // The plugin has connected to a VPN server.
  '4': 'NM_VPN_SERVICE_STATE_STARTED',
  // The plugin is disconnecting from the VPN server.
  '5': 'NM_VPN_SERVICE_STATE_STOPPING',
  // The plugin has disconnected from the VPN server.
  '6': 'NM_VPN_SERVICE_STATE_STOPPED',
}

enums.NM_VPN_PLUGIN_FAILURE = {
  // Login failed.
  '0': 'NM_VPN_PLUGIN_FAILURE_LOGIN_FAILED',
  // Connect failed.
  '1': 'NM_VPN_PLUGIN_FAILURE_CONNECT_FAILED',
  // Invalid IP configuration returned from the VPN plugin.
  '2': 'NM_VPN_PLUGIN_FAILURE_BAD_IP_CONFIG',
}

enums.NM_802_11_MODE = {
  // Mode is unknown.
  '0': 'NM_802_11_MODE_UNKNOWN',
  // For both devices and access point objects, indicates the object is part of an Ad-Hoc 802.11 network without a central coordinating access point.
  '1': 'NM_802_11_MODE_ADHOC',
  // The wireless device or access point is in infrastructure mode. For devices, this indicates the device is an 802.11 client/station. For access point objects, this indicates the object is an access point that provides connectivity to clients.
  '2': 'NM_802_11_MODE_INFRA',
  // The device is an access point/hotspot. Not valid for access point objects themselves.
  '3': 'NM_802_11_MODE_AP',
}

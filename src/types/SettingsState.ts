interface SettingsState {
  isSettings: boolean
  isClockVisible: boolean
  clockVisibleTimerId: number
  checkedNavIdx: number | null
  checkedSubsettingIndex: number | null
  appSettings: SettingsGroupKind[]
  defaultSettings: SettingsGroupKind[]
}

type SettingsGroupKind = SettingsGroup | SubsettingsGroup

interface SettingsGroup {
  id: number
  title: string
  groupChecked: boolean
  settings: SettingKind[]
}

function isSettingsGroup(group: object): group is SettingsGroup {
  return 'settings' in group
}

interface SubsettingsGroup extends SettingsGroup {
  subSettings: SettingsGroup[]
}

function isSubsettingsGroup(group: object): group is SubsettingsGroup {
  return 'subSettings' in group
}

type SettingKind = SettingMultiple | SettingToggle | SettingNumber

interface Setting {
  title: string
  type: string
}

interface SettingToggle extends Setting {
  selectedValue: boolean
}

interface SettingNumber extends Setting {
  selectedValue: number
}

function isSettingNumber(value: SettingKind): value is SettingNumber {
  return typeof value.selectedValue === 'number'
}

interface SettingMultiple extends Setting {
  selectedValue: string
  values: SettingMultipleValue[]
}

interface SettingMultipleValue {
  title: string
  value: string
}

export type {
  SettingsState,
  SettingsGroupKind,
  SettingsGroup,
  SubsettingsGroup,
  SettingKind,
  Setting,
  SettingToggle,
  SettingNumber,
  SettingMultiple,
  SettingMultipleValue,
}

export { isSubsettingsGroup, isSettingsGroup, isSettingNumber }
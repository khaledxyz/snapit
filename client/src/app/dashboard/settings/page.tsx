import { Profile } from "./_components/profile"
import { Password } from "./_components/password"
import { DangerZone } from "./_components/danger-zone"

export default function SettingsPage() {
    return (
        <div className="grid gap-6">
            <Profile />
            <Password />
            <DangerZone />
        </div>
    )
}

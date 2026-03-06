import LoginGoogleButton from '@/src/components/atoms/glogins'
import UserSession from '@/src/components/pages/(publicPage)/testLogin'

export default function Index() {
  return (
    <div className="flex flex-col gap-4 p-10">
      <LoginGoogleButton />
      <UserSession />
    </div>
  )
}
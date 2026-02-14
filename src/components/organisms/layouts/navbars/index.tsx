import Heads from '@/src/components/molecules/cards/heads'
import ProfileCardnavbar from '@/src/components/molecules/cards/profileCardNavbar'

export default function Navbar() {
    return (
        <section className='flex items-center justify-between gap-4 px-4 p-2'>
            <Heads label='Dashboard' className='text-3xl' iconSize={35} />
            <div className='flex-1'>
                <section className='w-full flex justify-center items-center gap-6'>
                    <p>Site</p>
                    <p>Floor</p>
                    <p>Room</p>
                    <p>Bed</p>
                    <p>Facility</p>
                </section>
            </div>
            <ProfileCardnavbar name={'Yaaqin'} email={'yaqin@mail.com'} avatarUrl={'https://i.pinimg.com/736x/68/b2/ac/68b2ace58b8a78df5abceafa4a80c8cd.jpg'} />
        </section>
    )
}

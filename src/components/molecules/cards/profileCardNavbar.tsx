import React from "react";
import Images from "../../atoms/images";

interface ProfileCardnavbarProps {
  name: string;
  email: string;
  avatarUrl: string;
  onActionClick?: () => void;
}

const ProfileCardnavbar: React.FC<ProfileCardnavbarProps> = ({
  name,
  email,
  avatarUrl,
  onActionClick,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#459997] px-3 py-2">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Images
          src={avatarUrl}
          alt={name}
          width={30}
          height={30}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="leading-tight">
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-500 dark:text-white">{email}</p>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onActionClick}
        className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-blue-300"
      >
        ⋮
      </button>
    </div>
  );
};

export default ProfileCardnavbar;

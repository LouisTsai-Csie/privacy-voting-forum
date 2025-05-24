"use client";

interface TeamMemberAvatarProps {
  photo: string;
  name: string;
  className?: string;
}

export default function TeamMemberAvatar({
  photo,
  name,
  className,
}: TeamMemberAvatarProps) {
  return (
    <img
      src={photo}
      alt={name}
      className={className}
      onError={(e) => {
        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random&size=96`;
      }}
    />
  );
}

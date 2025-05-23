

const Announcement = () => {
  return <div className="bg-neutral textWinDark p-4 rounded-md">
    <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400 ">View All</span>
    </div>
    <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">lorem ipsum dolor sit</h2>
                <span className="text-xs text-gray-400 bg-neutral rounded-md px-1 py-1">2025-01-01</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
                Li Yi Feng is a popular Chinese actor and singer, known for his roles in romantic and historical dramas.
            </p>
        </div>
        <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">lorem ipsum dolor sit</h2>
                <span className="text-xs text-gray-400 bg-neutral rounded-md px-1 py-1">2025-01-01</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
                Li Yi Feng is a popular Chinese actor and singer, known for his roles in romantic and historical dramas.
            </p>
        </div>
        <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">lorem ipsum dolor sit</h2>
                <span className="text-xs text-gray-400 bg-neutral rounded-md px-1 py-1">2025-01-01</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
                Li Yi Feng is a popular Chinese actor and singer, known for his roles in romantic and historical dramas.
            </p>
        </div>
    </div>
  </div>
};

export default Announcement;
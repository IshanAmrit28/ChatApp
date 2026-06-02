import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSide from "../components/RightSide";
import DiscoverContainer from "../components/DiscoverContainer";
import RequestsContainer from "../components/RequestsContainer";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";

const Home = () => {
  const { selectedUser, showRightSide } = useChatStore();
  const { activeTab } = useFriendStore();

  return (
    <div className="w-full h-screen">
      <div
        className={`backdrop-blur-xl overflow-hidden h-full grid grid-cols-1 relative ${
          selectedUser && showRightSide && activeTab === "chats"
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-[1fr_2.5fr] xl:grid-cols-[1fr_3fr]"
        }`}
      >
        <Sidebar />
        
        {activeTab === "chats" && (
          <>
            <ChatContainer />
            {selectedUser && showRightSide && <RightSide />}
          </>
        )}
        
        {activeTab === "discover" && <DiscoverContainer />}
        {activeTab === "requests" && <RequestsContainer />}
      </div>
    </div>
  );
};

export default Home;

import Modal from "@/components/Modal";
import Skelleton from "@/components/Skelleton";

export default async function VODVideoLoadingPage() {
  return (
    <Modal>
      <div className="flex flex-col gap-2 w-full items-center">
        <Skelleton width="1080px" height="8rem" />
        <Skelleton width="1080px" height="600px" />
        <Skelleton width="1080px" height="5rem" />
      </div>
    </Modal>
  );
}

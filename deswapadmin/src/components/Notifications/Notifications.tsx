import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

type NotificationType = {
    id: number;
    text: string;
};

const StackedNotifications = ({ id, text, setShow }: NotificationType & { setShow: Dispatch<SetStateAction<boolean>> }) => {
    const [notification, setNotification] = useState<NotificationType | null>(
        { id, text }
    );

    const removeNotif = () => {
        setShow(false);
        setNotification(null);
    };

    return (
        <AnimatePresence>
            {notification && (
                <Notification
                    removeNotif={removeNotif}
                    key={notification.id}
                    {...notification}
                />
            )}
        </AnimatePresence>
    );
};

const NOTIFICATION_TTL = 5000;

const Notification = ({
    text,
    id,
    removeNotif,
}: NotificationType & { removeNotif: Function }) => {
    useEffect(() => {
        const timeoutRef = setTimeout(() => {
            removeNotif();
        }, NOTIFICATION_TTL);

        return () => clearTimeout(timeoutRef);
        // eslint-disable-next-line
    }, []);

    return (
        <motion.div
            layout
            initial={{ y: 15, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -25, scale: 0.9, opacity: 0 }}
            transition={{ type: "spring" }}
            className="p-4 w-80 flex items-start rounded-lg gap-2 text-sm font-medium shadow-lg text-white bg-colors-black1 fixed z-50 bottom-4 right-4"
        >
            <FiAlertCircle className="text-3xl absolute -top-4 -left-4 p-2 rounded-full bg-white text-colors-black1 shadow" />
            <span>{text}</span>
            <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
                <FiX />
            </button>
        </motion.div>
    );
};

export default StackedNotifications;
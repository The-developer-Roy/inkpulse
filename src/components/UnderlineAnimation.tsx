"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface UnderlineAnimationProps {
    children: ReactNode;
    className?: string;
    underlineColor?: string;
    animationDuration?: number;
    underlineHeight?: number;
}

const UnderlineAnimation: React.FC<UnderlineAnimationProps> = ({
    children,
    className = "",
    underlineColor = "bg-blue-500",
    animationDuration = 0.3,
    underlineHeight = 2,
}) => {
    return (
        <motion.div
            className={`relative inline-block cursor-pointer ${className}`}
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            {children}
            <motion.div
                className={`absolute bottom-0 left-0 ${underlineColor}`}
                style={{ height: underlineHeight }}
                variants={{
                    rest: {
                        width: 0,
                        transition: {
                            duration: animationDuration,
                            ease: "easeInOut",
                        },
                    },
                    hover: {
                        width: "100%",
                        transition: {
                            duration: animationDuration,
                            ease: "easeInOut",
                        },
                    },
                }}
            />
        </motion.div>
    );
};

export default UnderlineAnimation;
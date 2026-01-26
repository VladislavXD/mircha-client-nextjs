"use client";

import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";

interface EmojiPickerProps {
	onEmojiSelect: (emojiUrl: string) => void;
	disabled?: boolean;
}

// Мини-набор emoji (url картинки). Можно расширить позже.
const EMOJI_LIST = [
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f604.png", name: "smile" },
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f602.png", name: "joy" },
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png", name: "heart" },
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png", name: "fire" },
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png", name: "thumbs-up" },
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png", name: "cool" },
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f622.png", name: "cry" },
	{ url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f914.png", name: "thinking" },
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, disabled = false }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleEmojiClick = (emojiUrl: string) => {
		onEmojiSelect(emojiUrl);
		setIsOpen(false);
	};

	return (
		<Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start">
			<PopoverTrigger>
				<Button
					isIconOnly
					variant="flat"
					className="bg-default-100 hover:bg-default-200"
					isDisabled={disabled}
					aria-label="Emoji"
				>
					<BsEmojiSmile size={20} className="text-default-600" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-2">
				<div className="w-[260px]">
					<div className="text-xs font-medium text-default-500 mb-2 px-1">Выберите emoji</div>
					<div className="grid grid-cols-8 gap-1">
						{EMOJI_LIST.map((emoji) => (
							<button
								key={emoji.url}
								type="button"
								onClick={() => handleEmojiClick(emoji.url)}
								className="w-8 h-8 flex items-center justify-center rounded hover:bg-default-100 transition-colors"
								title={emoji.name}
								disabled={disabled}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={emoji.url} alt={emoji.name} className="w-6 h-6" />
							</button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default EmojiPicker;

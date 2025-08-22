import React, { useState, useRef } from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { MdOutlineEmojiEmotions } from 'react-icons/md';

const emojiDataList = [
	{
		id: 1,
		name: 'gif1',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866750/vikostvspack_agaeyaacuz05sw_AgAEYAACuZ05Sw_small_uie6cz.gif',
	},
	{
		id: 2,
		name: 'gif2',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866749/vikostvspack_agadyfyaaor42es_AgADyFYAAor42Es_small_ufh0rf.gif',
	},
	{
		id: 3,
		name: 'gif3',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866748/vikostvspack_agadyfeaarjq-es_AgADyFEAArJq-Es_small_qkg0yu.gif',
	},
	{
		id: 4,
		name: 'gif4',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866743/vikostvspack_agadxweaamgokeg_AgADXWEAAmGoKEg_small_bkkxrk.gif',
	},
	{
		id: 5,
		name: 'gif5',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866743/vikostvspack_agadyeuaat3hoek_AgADYEUAAt3HoEk_small_hldr8u.gif',
	},
	{
		id: 6,
		name: 'gif6',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866742/vikostvspack_agadvjiaalt9keo_AgADvjIAAlt9kEo_small_fbrgyu.gif',
	},
	{
		id: 7,
		name: 'gif7',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866742/vikostvspack_agadxoiaaoevwes_AgADxoIAAoEVwEs_small_htyuqh.gif',
	},
	{
		id: 8,
		name: 'gif8',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866740/vikostvspack_agadtw4aahbpwug_AgADtW4AAhbpWUg_small_nr3rhs.gif',
	},
	{
		id: 9,
		name: 'gif9',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866737/vikostvspack_agadqz0aaorhueg_AgADqz0AAorHuEg_small_j2hmwe.gif',
	},
	{
		id: 10,
		name: 'gif10',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866736/vikostvspack_agadogsaahm1gek_AgADoGsAAhm1GEk_small_ngcqjf.gif',
	},
	{
		id: 11,
		name: 'gif11',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866736/vikostvspack_agadnu4aauu8-es_AgADnU4AAuu8-Es_small_nsptgz.gif',
	},
	{
		id: 12,
		name: 'gif12',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866735/vikostvspack_agadndwaavuqieo_AgADNDwAAvuqIEo_small_rq9x3p.gif',
	},
	{
		id: 13,
		name: 'gif13',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866734/vikostvspack_agadmuwaasefsus_AgADmUwAAsEFsUs_small_c9eea8.gif',
	},
	{
		id: 14,
		name: 'gif14',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866735/vikostvspack_agadmxeaareloug_AgADmXEAArEloUg_small_rp2c1m.gif',
	},
	{
		id: 15,
		name: 'gif15',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866731/vikostvspack_agadlmqaapkgces_AgADLmQAApKGCEs_small_h1fm2c.gif',
	},
	{
		id: 16,
		name: 'gif16',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866731/vikostvspack_agadklqaaribqek_AgADKlQAArIbqEk_small_b5babg.gif',
	},
	{
		id: 17,
		name: 'gif17',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866730/vikostvspack_agadjdkaakmrauo_AgADjDkAAkmraUo_small_us5zvt.gif',
	},
	{
		id: 18,
		name: 'gif18',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866729/vikostvspack_agadh0yaapwx4uo_AgADH0YAApwX4Uo_small_p1i6xd.gif',
	},
	{
		id: 19,
		name: 'gif19',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866729/vikostvspack_agadj2qaalqxsek_AgADj2QAAlQxsEk_small_s23til.gif',
	},
	{
		id: 20,
		name: 'gif20',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866729/vikostvspack_agadgkeaany2mus_AgADGkEAAnY2MUs_small_m1rifu.gif',
	},
	{
		id: 21,
		name: 'gif21',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866726/vikostvspack_agadg1gaaqdo8ek_AgADG1gAAqDo8Ek_small_hsnvsn.gif',
	},
	{
		id: 22,
		name: 'gif22',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866725/vikostvspack_agaddhmaaojekuk_AgADDHMAAoJeKUk_small_wmktvu.gif',
	},
	{
		id: 23,
		name: 'gif23',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866725/vikostvspack_agadddkaalnwuus_AgADdDkAAlnWUUs_small_x1hota.gif',
	},
	{
		id: 24,
		name: 'gif24',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866725/vikostvspack_agadcveaamkewug_AgADcVEAAmkewUg_small_r9dcjl.gif',
	},
	{
		id: 25,
		name: 'gif25',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866724/vikostvspack_agadaxwaaq7c0eo_AgADaxwAAq7c0Eo_small_r40tat.gif',
	},
	{
		id: 26,
		name: 'gif26',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866724/vikostvspack_agad5zmaavyf0eg_AgAD5zMAAvyF0Eg_small_wqi6gj.gif',
	},
	{
		id: 27,
		name: 'gif27',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866724/vikostvspack_agad2zsaamelaafk_AgAD2zsAAmeLAAFK_small_jjn2ih.gif',
	},
	{
		id: 28,
		name: 'gif28',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866724/vikostvspack_agad7fmaaob0kes_AgAD7FMAAoB0kEs_small_my1p1b.gif',
	},
	{
		id: 29,
		name: 'gif29',
		src: 'https://res.cloudinary.com/ddzprakot/image/upload/v1755866723/vikostvspack_agad2zmaakpyuuo_AgAD2zMAAkPYUUo_small_scsfzv.gif',
	},
]

interface EmojiPickerProps {
  onEmojiSelect: (emojiUrl: string) => void;
  disabled?: boolean;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiSrc: string) => {
    onEmojiSelect(emojiSrc);
    setIsOpen(false);
  };

  return (
    <Dropdown 
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      placement="top-start"
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="flat"
          disabled={disabled}
          className="min-w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-primary/30 transition-all duration-200"
          aria-label="Выбрать эмодзи"
        >
          <MdOutlineEmojiEmotions size={20} className="text-primary" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Выбор эмодзи"
        className="max-w-[420px]"
        variant="flat"
        closeOnSelect={false}
      >
        <DropdownItem key="emoji-grid" className="p-0" textValue="Emoji Grid">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-default-200">
              <MdOutlineEmojiEmotions className="text-primary" size={16} />
              <span className="text-sm font-medium text-default-600">Выберите эмодзи</span>
            </div>
            <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
              {emojiDataList.map((emoji) => (
                <button
                  key={emoji.id}
                  onClick={() => handleEmojiClick(emoji.src)}
                  className="w-12 h-12 rounded-xl overflow-hidden hover:scale-110 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-default-50 hover:bg-default-100"
                  title={emoji.name}
                >
                  <img
                    src={emoji.src}
                    alt={emoji.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default EmojiPicker;

import { FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaRotateLeft, FaRotateRight, FaTrash } from 'react-icons/fa6';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TiZoomInOutline, TiZoomOutOutline } from 'react-icons/ti';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import { AiFillSound } from 'react-icons/ai';
import { IoMdMore } from 'react-icons/io';
import { IoHome } from 'react-icons/io5';
import { Checkbox } from './ui/checkbox';
import ControlsBox from './ControlsBox';
import { Link } from 'react-router-dom';
import { Slider } from './ui/slider';
import { getHMS } from '@/lib/utils';
import { Button } from './ui/button';
import { Label } from './ui/label';

type TFileVideo = {
  fileType: 'video';

  onVolume: (newVolume: number) => void;
  onSeek: (timestamp: number) => void;
  onAutoPlay: () => void;
  playPause: () => void;
  onRepeat: () => void;

  totalTextDuration: string;
  currentSecond: number;
  autoRepeat: boolean;
  autoPlay: boolean;
  duration: number;
  pause: boolean;
  volume: number;
};
type TFileImage = {
  fileType: 'image';

  zoomIn: () => void;
  zoomOut: () => void;
  onCenter: () => void;
};
type TBoth = {
  onRotate: (side: 'LEFT' | 'RIGHT') => void;
  nextSlide: () => void;
  prevSlide: () => void;
  hideMenu: () => void;
  handleItemTrash: () => void;

  isMenuVisible: boolean;
  isPrev: boolean;
  isNext: boolean;
};
type TFileControls = { props: TFileImage | TFileVideo } & TBoth;
const FileControls = ({
  props,
  isNext,
  isPrev,
  nextSlide,
  onRotate,
  prevSlide,
  hideMenu,
  isMenuVisible,
  handleItemTrash,
}: TFileControls) => {
  const { fileType } = props;

  return (
    <ControlsBox onShow={hideMenu} visible={isMenuVisible} className="bottom-1 w-screen select-none px-2">
      <div className="flex justify-between space-x-2">
        <div className="flex space-x-1">
          <Button size="icon" onClick={prevSlide} disabled={!isPrev}>
            <FaChevronLeft />
          </Button>
          <Button size="icon" onClick={nextSlide} disabled={!isNext}>
            <FaChevronRight />
          </Button>
          {fileType === 'video' && (
            <Button onClick={props.playPause} size="icon">
              {props.pause ? <FaPlay /> : <FaPause />}
            </Button>
          )}
        </div>
        {fileType === 'video' && (
          <div className="flex flex-1 items-center space-x-2">
            <div>{getHMS(Math.round(props.currentSecond), props.duration).join(':')}</div>
            <Slider
              max={props.duration}
              step={0.1}
              defaultValue={[0]}
              onValueChange={(timeStamp) => props.onSeek(timeStamp[0])}
              value={[props.currentSecond]}
            />
            <div>{props.totalTextDuration}</div>
          </div>
        )}
        <div className="flex space-x-1">
          {fileType === 'video' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon">
                  <AiFillSound className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="relative h-[50vh] w-min">
                <Slider
                  orientation="vertical"
                  value={[props.volume]}
                  step={0.01}
                  max={1}
                  onValueChange={(newVolume) => props.onVolume(newVolume[0])}
                />
                <div className="absolute -top-5 left-0 flex w-full items-center text-sm text-muted-foreground">
                  {Math.round(props.volume * 100)}%
                </div>
              </PopoverContent>
            </Popover>
          )}
          {fileType === 'image' && (
            <>
              <Button size="icon" onClick={props.zoomIn}>
                <TiZoomInOutline className="h-6 w-6" />
              </Button>
              <Button size="icon" onClick={props.zoomOut}>
                <TiZoomOutOutline className="h-6 w-6" />
              </Button>
              <Button size="icon" onClick={props.onCenter}>
                <MdOutlineZoomOutMap className="h-6 w-6" />
              </Button>
            </>
          )}
          <Button size="icon" asChild>
            <Link to="/">
              <IoHome className="h-6 w-6" />
            </Link>
          </Button>

          <Button size="icon" onClick={handleItemTrash}>
            <FaTrash className="h-6 w-6" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon">
                <IoMdMore className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="relative w-min" align="center">
              <div className="space-y-4">
                {fileType === 'video' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="repeat">Repeat</Label>
                      <Checkbox id="repeat" onCheckedChange={() => props.onRepeat()} checked={props.autoRepeat} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="repeat">Auto play</Label>
                      <Checkbox id="repeat" onCheckedChange={() => props.onAutoPlay()} checked={props.autoPlay} />
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <Label>Rotate</Label>
                  <Button size="smallIcon" onClick={() => onRotate('LEFT')}>
                    <FaRotateLeft />
                  </Button>
                  <Button size="smallIcon" onClick={() => onRotate('RIGHT')}>
                    <FaRotateRight />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </ControlsBox>
  );
};

export default FileControls;

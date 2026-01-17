import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Todo, TodoStatus } from '../types';

interface SwipeCardProps {
  todo: Todo;
  onSwipe: (status: TodoStatus) => void;
}

const SwipeCard = ({ todo, onSwipe }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      // 一番大きい方向を判定
      const absX = Math.abs(info.offset.x);
      const absY = Math.abs(info.offset.y);
      
      if (absX > absY) {
        // 左右のスワイプ
        if (info.offset.x < 0) {
          onSwipe('pending'); // 左: 未実施
        } else {
          onSwipe('inProgress'); // 右: 進行中
        }
      } else {
        // 上下のスワイプ
        if (info.offset.y < 0) {
          onSwipe('completed'); // 上: 完了
        } else {
          onSwipe('archived'); // 下: アーカイブ
        }
      }
    }
  };

  return (
    <motion.div
      style={{
        x,
        y,
        rotateX,
        rotateY,
        opacity,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      className="swipe-card"
    >
      <h3>{todo.title}</h3>
      {todo.description && <p>{todo.description}</p>}
      
      <div className="swipe-hints">
        <span className="hint hint-left">未実施</span>
        <span className="hint hint-up">完了</span>
        <span className="hint hint-right">進行中</span>
        <span className="hint hint-down">アーカイブ</span>
      </div>
    </motion.div>
  );
};

export default SwipeCard;

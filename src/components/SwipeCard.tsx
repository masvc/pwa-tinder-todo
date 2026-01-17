import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Todo, TodoStatus } from '../types';

interface SwipeCardProps {
  todo: Todo;
  onSwipe: (status: TodoStatus | 'skip') => void;
}

const SwipeCard = ({ todo, onSwipe }: SwipeCardProps) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateZ = useTransform(x, [-200, 200], [-15, 15]);

  const handleDragEnd = async (_: any, info: any) => {
    const threshold = 80;
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;

    if (Math.abs(offsetX) > threshold || Math.abs(offsetY) > threshold) {
      const absX = Math.abs(offsetX);
      const absY = Math.abs(offsetY);

      let exitX = 0;
      let exitY = 0;
      let status: TodoStatus | 'skip';

      if (absX > absY) {
        exitX = offsetX > 0 ? 500 : -500;
        status = offsetX < 0 ? 'skip' : 'inProgress';
      } else {
        exitY = offsetY > 0 ? 500 : -500;
        status = offsetY < 0 ? 'completed' : 'archived';
      }

      await controls.start({
        x: exitX,
        y: exitY,
        opacity: 0,
        transition: { duration: 0.3 }
      });

      onSwipe(status);
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300 } });
    }
  };

  const priorityLabel = {
    high: '高',
    medium: '中',
    low: '低',
  };

  return (
    <motion.div
      style={{ x, y, rotateZ }}
      animate={controls}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className={`swipe-card priority-${todo.priority}`}
    >
      <div className="card-header">
        <span className={`priority-badge priority-${todo.priority}`}>
          {priorityLabel[todo.priority]}
        </span>
      </div>
      <div className="card-main">
        <h3>{todo.title || '(タイトルなし)'}</h3>
      </div>
      <div className="card-footer">
        {todo.description ? (
          <p>{todo.description}</p>
        ) : (
          <p className="no-desc">詳細なし</p>
        )}
      </div>

      <div className="swipe-hints">
        <span className="hint hint-left">スキップ</span>
        <span className="hint hint-up">完了</span>
        <span className="hint hint-right">進行中</span>
        <span className="hint hint-down">アーカイブ</span>
      </div>
    </motion.div>
  );
};

export default SwipeCard;

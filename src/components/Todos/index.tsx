import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

type Props = {
  todos: Todo[];
  todo: Todo;
  idTodo: number;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  onLoading: (status: boolean) => void;
  onError: (status: string) => void;
  onIdTodo: (id: number) => void;
  isSubmitting: boolean;
  onSubmit: (updateTodo: Todo | null) => void;
};

export const Todos: React.FC<Props> = ({
  todo,
  idTodo,
  onDelete,
  onUpdate,
  onLoading,
  onIdTodo,
  isSubmitting,
  onSubmit,
}) => {
  const { title, userId, id, completed } = todo;
  const [updateTodo, setUpdateTodo] = useState<Todo | null>(null);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (updateTodo) {
      titleField.current?.focus();
    }
  }, [updateTodo]);

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    onLoading(true);
    onIdTodo(id);
    const updateCompletedTodo = {
      ...todo,
      completed: event.target.checked,
    };

    onUpdate(updateCompletedTodo)
      .then(() => setUpdateTodo(null))
      .finally(() => {
        onLoading(false);
        onIdTodo(0);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setUpdateTodo(null);
      onIdTodo(0);

      return;
    }

    if (event.key === 'Enter' && !isSubmitting) {
      onSubmit(updateTodo);
    }
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setUpdateTodo(currentTodo => {
      if (!currentTodo) {
        return null;
      }

      return {
        ...currentTodo,
        title: event.target.value,
      };
    });
  };

  const handleBlur = () => {
    if (!isSubmitting) {
      onSubmit(updateTodo);
      setUpdateTodo(null);
      onIdTodo(0);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${completed && 'completed'}`} key={id}>
      {/* eslint-disable jsx-a11y/label-has-associated-control  */}
      <label className="todo__status-label" htmlFor={`${id}`}>
        <input
          id={`${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChecked}
        />
      </label>

      {updateTodo ? (
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
          }}
        >
          <input
            value={updateTodo?.title}
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={event => handleChangeTitle(event)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setUpdateTodo({ title, id, userId, completed });
              onIdTodo(id);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onIdTodo(id);
              onDelete(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': id === idTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

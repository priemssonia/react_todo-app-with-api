import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorsMessages';

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
  onError,
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

  const handleChecked = async (event: ChangeEvent<HTMLInputElement>) => {
    onLoading(true);
    onIdTodo(id);
    const updateCompletedTodo = {
      ...todo,
      completed: event.target.checked,
    };

    try {
      await onUpdate(updateCompletedTodo);
      setUpdateTodo(null);
    } catch (error) {
      onError(ErrorMessages.UNABLE_TO_UPDATE_TODO);
    } finally {
      onLoading(false);
      onIdTodo(0);
    }
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setUpdateTodo(null);
      onIdTodo(0);
      onLoading(false);

      return;
    }

    if (event.key === 'Enter' && !isSubmitting) {
      onLoading(true);
      if (updateTodo?.title.trim() === '') {
        try {
          await onDelete(id);
          setUpdateTodo(null);
          onIdTodo(0);
        } catch (error) {
          onError(ErrorMessages.UNABLE_TO_DELETE_TODO);
        } finally {
          onLoading(false);
        }
      } else {
        try {
          await onSubmit(updateTodo);
          setUpdateTodo(null);
          onIdTodo(0);
        } catch (error) {
          onError(ErrorMessages.UNABLE_TO_UPDATE_TODO);
        } finally {
          onLoading(false);
        }
      }
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

  const handleBlur = async () => {
    if (!isSubmitting) {
      onLoading(true);
      if (updateTodo?.title.trim() === '') {
        try {
          await onDelete(id);
          setUpdateTodo(null);
          onIdTodo(0);
        } catch (error) {
          onError(ErrorMessages.UNABLE_TO_DELETE_TODO);
        } finally {
          onLoading(false);
        }
      } else {
        try {
          await onSubmit(updateTodo);
          setUpdateTodo(null);
          onIdTodo(0);
        } catch (error) {
          onError(ErrorMessages.UNABLE_TO_UPDATE_TODO);
        } finally {
          onLoading(false);
        }
      }
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

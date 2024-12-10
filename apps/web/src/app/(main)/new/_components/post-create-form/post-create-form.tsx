'use client';

import { useDebounce } from 'ahooks';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { submitPost } from './actions/submit-post';
import * as styles from './post-create-form.css';
import { Button } from '../../../../../components/elements/button';
import { InputImageWithPreview } from '../input-image-with-preview';
import { VariableTextInput } from '../variable-text-input';

import type { InputImageWithPreviewHandle } from '../input-image-with-preview';
import type { ChangeEvent, FC } from 'react';

export type PostCreateFormProps = {
  className?: string | undefined;
};

export const PostCreateForm: FC<PostCreateFormProps> = ({
  className,
}) => {
  const router = useRouter();
  const inputRef = useRef<InputImageWithPreviewHandle>(null);
  const [word, setWord] = useState('Good');
  const debouncedWord = useDebounce(word, { wait: 500 });

  const handleSubmit = useCallback((formData: FormData): void => {
    toast.promise(async () => {
      const result = await submitPost(formData);
      if (result.type === 'error') {
        if (result.reason === 'unauthorized') router.push('/login');
        throw new Error(result.message);
      }

      inputRef.current?.reset();
      router.push(result.redirectUrl);
      return result.message;
    }, {
      loading: 'Submitting...',
      success: (result: string) => result,
      error: (error: Error) => error.message,
    });
  }, [router]);

  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setWord(event.target.value);
  }, []);

  return (
    <div className={clsx(className, styles.wrapper)}>
      <form action={handleSubmit}>
        <InputImageWithPreview ref={inputRef} word={debouncedWord} name="image" />
        <div className={styles.footer}>
          <div>
            Looks <VariableTextInput onChange={handleOnChange} className={styles.word} name="word" placeholder="Good" defaultValue="Good" /> To Me
          </div>
          <Button type="submit" variant="primary" className={styles.submit}>Submit</Button>
        </div>
      </form>
    </div>
  );
};

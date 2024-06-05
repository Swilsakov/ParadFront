"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import GreyButton from "../buttons/Grey";
import { useAccount } from "wagmi";
import styles from "@/styles/components/modal/create-debates.module.css";
import { motion } from "framer-motion";
import { useCreateDispute } from "@/hooks/useContractWriteForm";
import { useIsAdmin } from "@/hooks/useContractData";
import { IAnswer } from "@/interfaces/forms.interface";

interface CreateDisputeModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateDisputeModalButton() {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  // const isAdmin = useIsAdmin(address);
  const isAdmin = true;

  return (
    <>
      {isAdmin && (
        <>
          <GreyButton
            onClick={() => setOpen((prev) => !prev)}
            title="Create Dispute"
          />
          <CreateDisputeModal open={open} onClose={() => setOpen(false)} />
        </>
      )}
    </>
  );
}

export function CreateDisputeModal({ open, onClose }: CreateDisputeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [qtyAnswers, setQtyAnswers] = useState<number>(3);

  console.log(answers);
  // console.log(formData);

  const { txStatus, error, status, write } = useCreateDispute(formData);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string } = {};

    for (const [key, value] of formData.entries()) {
      formValues[key] = value as string;
    }

    // Добавляем ответы в объект formValues
    formValues["answers"] = answers;

    console.log(formValues);

    setFormData(formValues);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      write();
    }
  }, [formData]);

  function handleChangeQty(event: React.ChangeEvent<HTMLInputElement>) {
    setQtyAnswers(parseInt(event.target.value));
  }

  function handleChangeAnswer(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: string
  ) {
    const answersCopy = [...answers] as IAnswer[];
    answersCopy[index] = { ...answersCopy[index], [name]: event.target.value }; // Заменяем значение элемента массива на новый объект
    setAnswers(answersCopy);
  }
  return open ? (
    <motion.div
      className={styles.debates_modal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.debates_modal__container} ref={modalRef}>
        <h2 className="purple_color">Create Dispute</h2>
        <p className={styles.debates_modal__container__close} onClick={onClose}>
          &times;
        </p>
        <form
          className={styles.debates_modal__container__form}
          onSubmit={handleSubmit}
        >
          <div className={styles.debates_modal__container__form__group}>
            <h2>Group ID</h2>
            <input
              min={1}
              defaultValue={1}
              type="number"
              placeholder="Group ID"
              name="groupId"
              required
            />
          </div>
          <div className={styles.debates_modal__container__form__group}>
            <h2>Title</h2>
            <input placeholder="Title" name="point" required />
          </div>
          <div className={styles.debates_modal__container__form__group}>
            <h2>Amount Of Members</h2>
            <input
              min={0}
              defaultValue={0}
              type="number"
              placeholder="Amount Of Members"
              name="qtyMembers"
              required
            />
          </div>
          <div className={styles.debates_modal__container__form__group}>
            <h2>Upload Preview</h2>
            <input placeholder="Upload Preview" name="uploadPreview" required />
          </div>
          <div className={styles.debates_modal__container__form__group}>
            <h2>Required Amount Of Members</h2>
            <input
              min={0}
              defaultValue={100}
              type="number"
              placeholder="Required Amount Of Members"
              name="needQtyMembers"
              required
            />
          </div>
          <div className={styles.debates_modal__container__form__group}>
            <h2>Amount Of Answers</h2>
            <input
              min={0}
              defaultValue={qtyAnswers}
              onChange={handleChangeQty}
              type="number"
              placeholder="Quantity Of Answers"
              name="qtyAnswers"
              required
            />
          </div>
          <div className={styles.debates_modal__container__form__group}>
            <h2>URI String</h2>
            <input placeholder="URI String" name="uriString" required />
          </div>

          {Array.from({ length: qtyAnswers }, (_, i) => (
            <div
              key={i}
              className={styles.debates_modal__container__form__group}
            >
              <h2>Answer {i + 1}</h2>
              <input
                type="string"
                value={answers[i]?.answer}
                placeholder={`Answer`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeAnswer(e, i, "answer")
                }
              />
              <input
                type="string"
                value={answers[i]?.image}
                placeholder={`Image URI`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeAnswer(e, i, "image")
                }
              />
            </div>
          ))}
          <GreyButton
            type="submit"
            style={{ width: "100%", marginTop: 10 }}
            title="Create"
          />
        </form>
      </div>
    </motion.div>
  ) : undefined;
}

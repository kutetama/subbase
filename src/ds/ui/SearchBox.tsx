// 원본: TOAST asset/components/common/input/SearchBox.tsx (W2 보류분 — FetchStatusGate 착지로 해소)
// 변경: cn/getAppIcon 경로 교체, FetchStatusGate→@/ds/biz, IconCheckbox·SearchBoxSelectedItem→@/ds/ui,
//       타입은 SearchBoxSelectedItem의 export 재사용(중복 정의 방지).
// 리매핑: border-semantic-lineGray→border-line, bg-white→bg-surface, rounded-lgx→rounded-control,
//         호버·선택 틴트 bg-primary-bg→bg-accent-bg, text-semantic-error→text-danger,
//         text-neutral-darkMiddleGray→text-fg-subtle, text-neutral-darkGray→text-fg-muted, gap-5px→gap-[5px].
// 오타 클래스 수정: text-nuetral-black→text-fg, hover:text-nuetral-darkGray→hover:text-fg-muted (확정 지침).
import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/ds/lib/cn";
import { getAppIcon } from "@/ds/icons";

import type { IdNameSearchBoxProps, SearchBoxUIType } from "@/ds/ui/SearchBoxSelectedItem";

import FetchStatusGate from "@/ds/biz/FetchStatusGate";
import IconCheckbox from "@/ds/ui/IconCheckbox";
import SearchBoxSelectedItem from "@/ds/ui/SearchBoxSelectedItem";

export interface SearchBoxProps {
  loading?: boolean;
  placeholder: string;
  /**
   * 검색 결과 표시 방식
   * - `default`: name 만 표시
   * - `desc`: name과 desc 함께 표시
   */
  type?: SearchBoxUIType;
  searchList: IdNameSearchBoxProps[] | null; //null: 리스트 제공하지 않음, [] 빈배열: 검색된 리스트가 없음
  selectedList: IdNameSearchBoxProps[];
  triggerOnEnter?: boolean;
  multiple?: boolean;
  inline?: boolean;
  disabled?: boolean;
  invalidText?: string;
  emptyText?: string;
  showSelectedValue?: boolean;
  onChange: (value: string) => void;
  onSelected: (els: IdNameSearchBoxProps[]) => void;
}

const SearchBox = ({
  loading = false,
  placeholder,
  type = "default",
  searchList,
  selectedList,
  triggerOnEnter = false,
  multiple = false,
  inline = false,
  disabled = false,
  invalidText,
  emptyText,
  showSelectedValue = false,
  onChange,
  onSelected,
}: SearchBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const [listOpen, setListOpen] = useState<boolean>(false);
  const [selectedPairs, setSelectedPairs] = useState<IdNameSearchBoxProps[]>(selectedList);

  useEffect(() => {
    setSelectedPairs(selectedList);

    if (listOpen) return; // 리스트가 open 상태이면 검색 중이므로 value를 자동 세팅하지 않는다
    if (showSelectedValue && !multiple && selectedPairs.length !== 0) {
      setValue(selectedPairs[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 원본 의존성 유지
  }, [selectedList]);

  const handleMultipleSelection = (el: IdNameSearchBoxProps) => {
    setSelectedPairs((previous) => {
      const hasElement = previous.some((item) => item.id === el.id);
      const list = hasElement
        ? previous.filter((item) => item.id !== el.id)
        : [...previous, el];
      onSelected(list);
      return list;
    });
  };

  const handleSingleSelection = (el: IdNameSearchBoxProps) => {
    const list = [el];
    onSelected(list);
    setSelectedPairs(list);
    if (showSelectedValue) setValue(el.name);
  };

  return (
    <Popover.Root open={listOpen} onOpenChange={setListOpen}>
      <div className={cn("relative", inline && "inline")}>
        <div className="relative">
          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            {getAppIcon("OL_SEARCH", { size: 16, colorClass: "text-fg-subtle" })}
          </div>
          <Popover.Anchor>
            <input
              ref={inputRef}
              type="text"
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              onClick={() => {
                setListOpen(true);
                setTimeout(() => {
                  inputRef.current?.focus(); // 강제 focus 복구
                }, 0);
              }}
              onChange={(e) => {
                if (!triggerOnEnter) {
                  onChange(e.target.value);
                }
                setValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (triggerOnEnter && e.key === "Enter") {
                  onChange(value);
                }
              }}
              onBlur={() => {
                if (showSelectedValue && !multiple && selectedPairs.length !== 0) {
                  setValue(selectedPairs[0].name);
                }
              }}
              className={cn(
                "w-full h-9 py-2 px-4 pl-9 border border-line bg-surface rounded-control text-fg typo-regular_smalllP transition-colors",
                "hover:bg-accent-bg hover:text-fg-muted",
                "focus:border-primary-light",
                "disabled:bg-semantic-bg disabled:text-neutral-middleGray",
                invalidText && "pr-9 border-semantic-error",
              )}
            />
          </Popover.Anchor>
          {invalidText && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {getAppIcon("EXCLAMATION_CIRCLE", { size: 16, colorClass: "text-danger" })}
            </div>
          )}
        </div>

        {invalidText && (
          <div className="ml-3.5 typo-regular_caption text-danger">{invalidText}</div>
        )}

        {!(inline && listOpen) && (
          <>
            {multiple && selectedPairs.length > 0 && (
              <div
                className={cn(
                  "flex flex-wrap max-w-full min-w-0 w-full gap-2 pt-2",
                  type === "desc" && "flex-col",
                )}
              >
                {selectedPairs.map((el) => (
                  <SearchBoxSelectedItem
                    key={el.id}
                    data={el}
                    type={type}
                    onClick={() => {
                      if (multiple) {
                        handleMultipleSelection(el);
                      } else {
                        setSelectedPairs([]);
                        onSelected([]);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          onInteractOutside={(e) => {
            // input에 포커스 주는 건 dismiss 대상에서 제외
            if (inputRef.current?.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
          className="w-[--radix-popover-trigger-width] z-10"
        >
          {searchList !== null && (
            <div className="bg-surface border border-line rounded-control">
              <FetchStatusGate loading={loading}>
                {searchList.length > 0 ? (
                  <ul className="scrollbar-default max-h-60 my-1.5 mr-1.5">
                    {searchList.map((el, index) => (
                      <li key={el.id}>
                        <button
                          type="button"
                          onClick={() => {
                            if (multiple) handleMultipleSelection(el);
                            else {
                              handleSingleSelection(el);
                              setListOpen(false);
                            }
                          }}
                          className={cn(
                            "w-full py-2 px-4 cursor-pointer text-left",
                            searchList.length - 1 !== index && "border-b border-line",
                            "hover:bg-accent-bg",
                            !multiple && selectedPairs.some((item) => item.id === el.id) && "bg-accent-bg",
                          )}
                          title={el.name}
                        >
                        <div className="flex items-start gap-2">
                          {multiple && selectedPairs.some((item) => item.id === el.id) && (
                            <span className="shrink-0 mt-[3px]">
                              <IconCheckbox checked={true} />
                            </span>
                          )}
                          <div className="flex-1 flex flex-col">
                            <span>{el.name}</span>
                            {type === "desc" && (
                              <span className="typo-regular_caption text-fg-subtle">
                                {el.description}
                              </span>
                            )}
                          </div>
                        </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul>
                    <li
                      className={cn(
                        "overflow-hidden h-[132px] px-4 text-ellipsis whitespace-nowrap flex flex-col justify-center items-center gap-[5px]", // gap-5px
                      )}
                      title={emptyText}
                    >
                      {getAppIcon("OL_SEARCH_CIRCLE", {
                        colorClass: "text-neutral-middleGray",
                        size: 21,
                      })}
                      <p className="text-fg-muted typo-semiBold_smalllP">
                        {emptyText ?? "검색 결과가 없습니다."}
                      </p>
                    </li>
                  </ul>
                )}
              </FetchStatusGate>
            </div>
          )}
        </Popover.Content>
      </div>
    </Popover.Root>
  );
};

export default SearchBox;

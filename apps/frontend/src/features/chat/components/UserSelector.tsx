import { useState, useMemo, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/shared/Avatar';
import { useUsers } from '@/features/hooks';

interface UserSelectorProps {
  selectedUsers: string[];
  onSelectionChange: (users: string[]) => void;
  excludeUserIds?: string[];
  searchPlaceholder?: string;
  label?: string;
}

export function UserSelector({
  selectedUsers,
  onSelectionChange,
  excludeUserIds = [],
  searchPlaceholder = 'Search users',
  label = 'Add Members',
}: UserSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Fetch all users
  const { data: users = [] } = useUsers();

  // Filter users based on exclusions and search
  const filteredOptions = useMemo(() => {
    return users.filter((user) => {
      const isNotExcluded = !excludeUserIds.includes(user.id);
      const matchesSearch = user.userName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isNotExcluded && matchesSearch;
    });
  }, [users, excludeUserIds, searchQuery]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Add or remove user from selection
  const toggleUser = (id: string) => {
    const newSelection = selectedUsers.includes(id)
      ? selectedUsers.filter((u) => u !== id)
      : [...selectedUsers, id];
    onSelectionChange(newSelection);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Guard against empty filtered list
    if (filteredOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          toggleUser(filteredOptions[highlightedIndex].id);
        }
        break;
    }
  };

  return (
    <div className='grid gap-2'>
      <label className='text-sm font-medium'>{label}</label>

      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={searchPlaceholder}
        onKeyDown={handleKeyDown}
      />

      <div className='max-h-[200px] overflow-y-auto'>
        {filteredOptions.length === 0 ? (
          <div className='text-center py-4 text-muted-foreground text-sm'>
            {searchQuery
              ? 'No users found matching your search'
              : 'No users available'}
          </div>
        ) : (
          filteredOptions.map((user, index) => {
            const isSelected = selectedUsers.includes(user.id);
            const isHighlighted = index === highlightedIndex;

            return (
              <div
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors
                  ${isSelected ? 'bg-primary/10 border border-primary/20' : ''}
                  ${isHighlighted ? 'bg-accent' : ''}
                  hover:bg-accent`}
              >
                <Avatar name={user.userName} />
                <span className={isSelected ? 'font-medium' : ''}>
                  {user.userName}
                </span>
                <div className='ml-auto' onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    className='ml-auto pointer-events-none'
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected count */}
      {selectedUsers.length > 0 && (
        <div className='text-sm text-muted-foreground'>
          {selectedUsers.length} user(s) selected
        </div>
      )}
    </div>
  );
}

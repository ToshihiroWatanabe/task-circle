package net.task_circle.mapper;

import org.apache.ibatis.annotations.Mapper;

import net.task_circle.model.User;

/**
 * usersテーブルに関するマッパーインターフェースです。
 */
@Mapper
public interface UserMapper {
    /**
     * トークンIDからユーザー情報を取得します。
     * 
     * @param tokenId トークンID
     * @return ユーザー情報
     */
    public User findByTokenId(String tokenId);

    /**
     * ユーザーを作成します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean create(User user);

    /**
     * ユーザー情報を更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean update(User user);

    /**
     * トークンIDとアイコン画像のURLを更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean updateTokenAndImageUrl(User user);

}

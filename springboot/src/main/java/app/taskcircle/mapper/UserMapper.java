package app.taskcircle.mapper;

import org.apache.ibatis.annotations.Mapper;

import app.taskcircle.model.User;

/**
 * usersテーブルのマッパーインターフェースです。
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
     * トークンIDとプロフィール画像のURLを更新します。
     * 
     * @param user ユーザー情報
     * @return 成功した場合はtrue
     */
    public boolean updateTokenId(User user);

}
